"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Server,
  Shield,
  Ban,
  CheckCircle,
  UserPlus,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Import the package
import NDK from "@nostr-dev-kit/ndk";

export default function DashboardPage() {
  const [relayUrl, setRelayUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // State for relay management
  const [allowedPubkeys, setAllowedPubkeys] = useState<Array<{pubkey: string, reason?: string}>>([])
  const [bannedPubkeys, setBannedPubkeys] = useState<Array<{pubkey: string, reason?: string}>>([])
  const [newPubkey, setNewPubkey] = useState("")
  const [reason, setReason] = useState("")
  const [isOperating, setIsOperating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Relay Management Functions according to NIP-86
  const makeRelayRequest = useCallback(async (method: string, params: string[]): Promise<unknown> => {
    if (!relayUrl) return null

    const relayHttp = relayUrl.replace("ws://", "http://").replace("wss://", "https://") // Convert wss to https for HTTP requests

    try {
      setError(null)
      
      // Get NIP-07 extension
      if (!window.nostr) {
        throw new Error("NIP-07 extension not found. Please install a Nostr extension like Alby or nos2x.")
      }

      // Get user's public key
      const userPubkey = await window.nostr.getPublicKey()

      // Create the request payload
      const requestPayload = JSON.stringify({ method, params })
      
      // Calculate SHA256 hash of the payload
      const encoder = new TextEncoder()
      const data = encoder.encode(requestPayload)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const payloadHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Create NIP-98 authorization event
      const authEvent = {
        kind: 27235,
        pubkey: userPubkey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["u", relayHttp],
          ["method", "POST"],
          ["payload", payloadHash]
        ],
        content: ""
      }

      // Sign the auth event using NIP-07
      const signedAuthEvent = await window.nostr.signEvent(authEvent)
      
      // Make HTTP request to relay
      const response = await fetch(relayHttp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/nostr+json+rpc',
          'Authorization': `Nostr ${btoa(JSON.stringify(signedAuthEvent))}`
        },
        body: requestPayload
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      return result.result
    } catch (err) {
      console.error('Relay request error:', err)
      throw err
    }
  }, [relayUrl])

  // Load allowed pubkeys
  const loadAllowedPubkeys = useCallback(async () => {
    try {
      const result = await makeRelayRequest('listallowedpubkeys', []) as Array<{pubkey: string, reason?: string}>
      if (result) {
        setAllowedPubkeys(result)
      }
    } catch (err) {
      setError(`Failed to load allowed pubkeys: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }, [makeRelayRequest])

  // Load banned pubkeys
  const loadBannedPubkeys = useCallback(async () => {
    try {
      const result = await makeRelayRequest('listbannedpubkeys', []) as Array<{pubkey: string, reason?: string}>
      if (result) {
        setBannedPubkeys(result)
      }
    } catch (err) {
      setError(`Failed to load banned pubkeys: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }, [makeRelayRequest])

  // Allow a pubkey
  const allowPubkey = useCallback(async (pubkey: string, reason?: string) => {
    try {
      setIsOperating(true)
      const params = reason ? [pubkey, reason] : [pubkey]
      await makeRelayRequest('allowpubkey', params)
      setSuccess(`Successfully allowed pubkey: ${pubkey}`)
      await loadAllowedPubkeys()
      setNewPubkey("")
      setReason("")
    } catch (err) {
      setError(`Failed to allow pubkey: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsOperating(false)
    }
  }, [makeRelayRequest, loadAllowedPubkeys])

  // Ban a pubkey
  const banPubkey = useCallback(async (pubkey: string, reason?: string) => {
    try {
      setIsOperating(true)
      const params = reason ? [pubkey, reason] : [pubkey]
      await makeRelayRequest('banpubkey', params)
      setSuccess(`Successfully banned pubkey: ${pubkey}`)
      await loadBannedPubkeys()
      await loadAllowedPubkeys()
      setNewPubkey("")
      setReason("")
    } catch (err) {
      setError(`Failed to ban pubkey: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsOperating(false)
    }
  }, [makeRelayRequest, loadBannedPubkeys, loadAllowedPubkeys])

  // Validate pubkey format
  const isValidPubkey = useCallback((pubkey: string) => {
    return /^[0-9a-f]{64}$/i.test(pubkey)
  }, [])

  // Load data on mount
  useEffect(() => {
    if (relayUrl) {
      loadAllowedPubkeys()
      loadBannedPubkeys()
    }
  }, [relayUrl, loadAllowedPubkeys, loadBannedPubkeys])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  useEffect(() => {
    const checkRelay = async () => {
      // Check if relay URL is set in localStorage
      const savedRelayUrl = localStorage.getItem("relayUrl")

      if (!savedRelayUrl) {
        // Redirect to setup page if no relay URL is found
        router.push("/setup")
      } else {

        // Create a new NDK instance with explicit relays
        const ndk = new NDK({
          explicitRelayUrls: [savedRelayUrl],
        });

        // Now connect to specified relays
        await ndk.connect();

        setRelayUrl(savedRelayUrl)
        setIsLoading(false)
      }
    }
    checkRelay();
  }, [router])

  // Display loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Get the relay domain from the URL for display
  const relayDomain = relayUrl ? new URL(relayUrl).host : "my-relay.com"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Server className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">
                  Relay Control Panel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Managing: {relayDomain}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                loadAllowedPubkeys()
                loadBannedPubkeys()
              }}
              variant="outline"
              size="sm"
              disabled={isOperating}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isOperating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Management Card - Always visible at top */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Pubkey Management</span>
            </CardTitle>
            <CardDescription>
              Allow or ban public keys from interacting with your relay
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="pubkey" className="text-sm font-medium">
                  Public Key (64-character hex)
                </label>
                <Input
                  id="pubkey"
                  placeholder="e.g., 3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d"
                  value={newPubkey}
                  onChange={(e) => setNewPubkey(e.target.value)}
                  className="font-mono text-sm"
                />
                {newPubkey && !isValidPubkey(newPubkey) && (
                  <p className="text-sm text-destructive">Invalid pubkey format</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason (optional)
                </label>
                <Input
                  id="reason"
                  placeholder="Optional reason for this action"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => allowPubkey(newPubkey, reason || undefined)}
                disabled={!isValidPubkey(newPubkey) || isOperating}
                className="flex items-center justify-center space-x-2 flex-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>Allow Pubkey</span>
              </Button>
              
              <Button
                onClick={() => banPubkey(newPubkey, reason || undefined)}
                disabled={!isValidPubkey(newPubkey) || isOperating}
                variant="destructive"
                className="flex items-center justify-center space-x-2 flex-1"
              >
                <Ban className="h-4 w-4" />
                <span>Ban Pubkey</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for listing pubkeys */}
        <Tabs defaultValue="allowed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="allowed" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Allowed ({allowedPubkeys.length})</span>
            </TabsTrigger>
            <TabsTrigger value="banned" className="flex items-center space-x-2">
              <Ban className="h-4 w-4" />
              <span>Banned ({bannedPubkeys.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Allowed Pubkeys Tab */}
          <TabsContent value="allowed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Allowed Pubkeys</span>
                </CardTitle>
                <CardDescription>
                  Public keys that are explicitly allowed on this relay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {allowedPubkeys.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">No allowed pubkeys configured</p>
                      <p className="text-muted-foreground text-sm">Add a pubkey above to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allowedPubkeys.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="font-mono text-sm break-all">
                              {item.pubkey}
                            </div>
                            {item.reason && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {item.reason}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => banPubkey(item.pubkey, "Moved to banned list")}
                            disabled={isOperating}
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                          >
                            <Ban className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Ban</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banned Pubkeys Tab */}
          <TabsContent value="banned">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ban className="h-5 w-5" />
                  <span>Banned Pubkeys</span>
                </CardTitle>
                <CardDescription>
                  Public keys that are banned from this relay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {bannedPubkeys.length === 0 ? (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">No banned pubkeys</p>
                      <p className="text-muted-foreground text-sm">Your relay is open to everyone</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bannedPubkeys.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="font-mono text-sm break-all">
                              {item.pubkey}
                            </div>
                            {item.reason && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {item.reason}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => allowPubkey(item.pubkey, "Moved to allowed list")}
                            disabled={isOperating}
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                          >
                            <UserPlus className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Allow</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
