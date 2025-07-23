"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Server,
  Settings,
  Shield,
  Home,
  Menu,
  Ban,
  CheckCircle,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
// Import the package
import NDK from "@nostr-dev-kit/ndk";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

      // Create NIP-98 authorization event
      const authEvent = {
        kind: 27235,
        pubkey: userPubkey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["u", relayHttp],
          ["method", "POST"],
          ["payload", JSON.stringify({ method, params })]
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
        body: JSON.stringify({ method, params })
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
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  // Get the relay domain from the URL for display
  const relayDomain = relayUrl ? new URL(relayUrl).host : "my-relay.com"

  const sidebar = (
    <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex h-14 items-center border-b px-4">
        <Server className="mr-2 h-6 w-6" />
        <span className="font-semibold">Relay Control</span>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <Link 
          href="/" 
          className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
          <Settings className="h-4 w-4" />
          <span>Dashboard</span>
        </div>
      </nav>
      <div className="border-t p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Managing: {relayDomain}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {sidebar}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {sidebar}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center border-b bg-white px-4 dark:bg-gray-900">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <h1 className="ml-4 text-xl font-semibold md:ml-0">Relay Management Dashboard</h1>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Status Messages */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
              {success}
            </div>
          )}

          <Tabs defaultValue="management" className="space-y-6">
            <TabsList>
              <TabsTrigger value="management">Pubkey Management</TabsTrigger>
              <TabsTrigger value="allowed">Allowed Pubkeys</TabsTrigger>
              <TabsTrigger value="banned">Banned Pubkeys</TabsTrigger>
            </TabsList>

            {/* Pubkey Management Tab */}
            <TabsContent value="management" className="space-y-6">
              <Card>
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
                      <p className="text-sm text-red-500">Invalid pubkey format</p>
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
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => allowPubkey(newPubkey, reason || undefined)}
                      disabled={!isValidPubkey(newPubkey) || isOperating}
                      className="flex items-center space-x-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Allow Pubkey</span>
                    </Button>
                    
                    <Button
                      onClick={() => banPubkey(newPubkey, reason || undefined)}
                      disabled={!isValidPubkey(newPubkey) || isOperating}
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Ban Pubkey</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Allowed Pubkeys Tab */}
            <TabsContent value="allowed" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Allowed Pubkeys ({allowedPubkeys.length})</span>
                  </CardTitle>
                  <CardDescription>
                    Public keys that are explicitly allowed on this relay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {allowedPubkeys.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No allowed pubkeys configured</p>
                    ) : (
                      <div className="space-y-2">
                        {allowedPubkeys.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm break-all">{item.pubkey}</div>
                              {item.reason && (
                                <div className="text-sm text-gray-500 mt-1">{item.reason}</div>
                              )}
                            </div>
                            <Button
                              onClick={() => banPubkey(item.pubkey, "Moved to banned list")}
                              disabled={isOperating}
                              variant="outline"
                              size="sm"
                              className="ml-2"
                            >
                              <Ban className="h-4 w-4" />
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
            <TabsContent value="banned" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Ban className="h-5 w-5 text-red-500" />
                    <span>Banned Pubkeys ({bannedPubkeys.length})</span>
                  </CardTitle>
                  <CardDescription>
                    Public keys that are banned from this relay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {bannedPubkeys.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No banned pubkeys</p>
                    ) : (
                      <div className="space-y-2">
                        {bannedPubkeys.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm break-all">{item.pubkey}</div>
                              {item.reason && (
                                <div className="text-sm text-gray-500 mt-1">{item.reason}</div>
                              )}
                            </div>
                            <Button
                              onClick={() => allowPubkey(item.pubkey, "Moved to allowed list")}
                              disabled={isOperating}
                              variant="outline"
                              size="sm"
                              className="ml-2"
                            >
                              <UserPlus className="h-4 w-4" />
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
        </main>
      </div>
    </div>
  )
}
