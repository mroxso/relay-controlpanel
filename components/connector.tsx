"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface RelayInfo {
    name?: string
    description?: string
    pubkey?: string
    contact?: string
    supported_nips?: number[]
    software?: string
    version?: string
    [key: string]: any
}

export default function Connector() {
    const [relayUrl, setRelayUrl] = useState("")
    // const [url, setUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [relayInfo, setRelayInfo] = useState<RelayInfo | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchRelayInfo = async () => {
            if (!relayUrl) {
                setRelayInfo(null)
                setError(null)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                // Convert WebSocket URL to HTTP/HTTPS
                const httpUrl = relayUrl.replace(/^wss?:\/\//i, (match) => (match === "ws://" ? "http://" : "https://"))

                const response = await fetch(httpUrl, {
                    headers: {
                        Accept: "application/nostr+json",
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch relay info: ${response.status}`)
                }

                const data = await response.json()
                setRelayInfo(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch relay information")
                setRelayInfo(null)
            } finally {
                setIsLoading(false)
            }
        }

        // Debounce the fetch to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchRelayInfo()
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [relayUrl])

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Validate the URL format
        try {
            // Simple validation for websocket URL format
            if (!relayUrl.trim()) {
                throw new Error("Please enter a relay URL")
            }

            // Check if it's a valid URL
            const url = new URL(relayUrl)

            // Check if it's a ws:// or wss:// protocol
            if (!url.protocol.match(/^wss?:$/)) {
                throw new Error("Relay URL must use WebSocket protocol (ws:// or wss://)")
            }

            // Save to localStorage
            localStorage.setItem("relayUrl", relayUrl.trim())

            // Redirect to dashboard
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || "Invalid relay URL format")
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Nostr Relay Connector</CardTitle>
                <CardDescription>Enter a WebSocket URL to connect to a Nostr relay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="websocket-url" className="text-sm font-medium">
                        WebSocket URL
                    </label>
                    <Input
                        id="websocket-url"
                        placeholder="wss://relay.example.com"
                        value={relayUrl}
                        onChange={(e) => setRelayUrl(e.target.value)}
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Example: wss://relay.damus.io</p>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span className="ml-2 text-sm">Checking relay...</span>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {relayInfo && (
                    <div className="space-y-4">
                        <Alert variant="default" className="bg-green-50 border-green-200">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-600">Successfully connected to relay</AlertDescription>
                        </Alert>

                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium">Name:</span> {relayInfo.name || "N/A"}
                            </div>
                            {relayInfo.description && (
                                <div>
                                    <span className="font-medium">Description:</span> {relayInfo.description}
                                </div>
                            )}
                            {relayInfo.supported_nips && (
                                <div>
                                    <span className="font-medium">Supported NIPs:</span> {relayInfo.supported_nips.join(", ")}
                                </div>
                            )}
                        </div>

                        <Button className="w-full" onClick={handleConnect}>
                            Connect as Admin
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
