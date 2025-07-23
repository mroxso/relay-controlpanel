"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Server,
  Users,
  FileText,
  Settings,
  Shield,
  Lock,
  Home,
  Menu,
  ChevronDown,
  Search,
  Ban,
  CheckCircle,
  UserPlus,
  UserMinus,
  FileCheck,
  FileMinus,
  Hash,
  Wifi,
  WifiOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
// Import the package
import NDK from "@nostr-dev-kit/ndk";

export default function DashboardPage() {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [relayUrl, setRelayUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-none">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Server className="h-6 w-6" />
                <span>NOSTR Relay Manager</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="#user-management"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users className="h-5 w-5" />
                User Management
              </Link>
              <Link
                href="#event-moderation"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FileText className="h-5 w-5" />
                Event Moderation
              </Link>
              <Link
                href="#relay-config"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Relay Configuration
              </Link>
              <Link
                href="#content-policy"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Shield className="h-5 w-5" />
                Content Policy
              </Link>
              <Link
                href="#security"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Lock className="h-5 w-5" />
                Security
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <Server className="h-6 w-6" />
          </Link>
          <Link href="/" className="hidden items-center gap-2 md:flex">
            <Server className="h-6 w-6" />
            <span className="text-lg font-bold">NOSTR Relay Manager</span>
          </Link>
        </div>
        {/* <div className="relative flex-1 md:grow-0 md:basis-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
          />
        </div> */}
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {relayDomain} <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                router.push('/setup');
              }}>Change Relay Connection</DropdownMenuItem>
              <DropdownMenuItem>Add New Relay</DropdownMenuItem>
              <DropdownMenuItem>Manage Relays</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary text-primary-foreground px-3 py-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="#user-management"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
            >
              <Users className="h-4 w-4" />
              User Management
            </Link>
            <Link
              href="#event-moderation"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              Event Moderation
            </Link>
            <Link
              href="#relay-config"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Relay Configuration
            </Link>
            <Link
              href="#content-policy"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
            >
              <Shield className="h-4 w-4" />
              Content Policy
            </Link>
            <Link
              href="#security"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted hover:text-primary"
            >
              <Lock className="h-4 w-4" />
              Security
            </Link>
          </nav>
        </aside>
        <main className="flex flex-col gap-6 p-4 md:gap-8 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="grid gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Manage your NOSTR relay with the NIP-86 API</p>
            </div>
            <div className="ml-auto flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm">
                <FileCheck className="mr-2 h-4 w-4" />
                View API Docs
              </Button>
              <Button size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Relay Settings
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Users</CardTitle>
                <CardDescription>User management statistics</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-3xl font-bold">1,254</div>
                <div className="text-xs text-muted-foreground">+12% from last month</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">42 allowed</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserMinus className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">18 banned</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Events</CardTitle>
                <CardDescription>Event moderation statistics</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-3xl font-bold">8,642</div>
                <div className="text-xs text-muted-foreground">+24% from last month</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">8,624 allowed</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileMinus className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">18 banned</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Moderate Events
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Security</CardTitle>
                <CardDescription>Security statistics</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-3xl font-bold">24</div>
                <div className="text-xs text-muted-foreground">Blocked IP addresses</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">12 allowed kinds</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">3 blocked today</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Security Settings
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div id="user-management">
            <h2 className="text-xl font-bold tracking-tight mb-4">User Management</h2>
            <Tabs defaultValue="banned">
              <TabsList className="mb-4">
                <TabsTrigger value="banned">Banned Users</TabsTrigger>
                <TabsTrigger value="allowed">Allowed Users</TabsTrigger>
              </TabsList>
              <TabsContent value="banned">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Banned Public Keys</CardTitle>
                      <Button size="sm">
                        <Ban className="mr-2 h-4 w-4" />
                        Ban User
                      </Button>
                    </div>
                    <CardDescription>Users that are banned from your relay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-start justify-between border-b pb-4">
                            <div>
                              <div className="font-medium truncate max-w-[300px]">
                                npub1abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">Banned for: Spam content</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Banned on: {new Date().toLocaleDateString()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Allow User
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="allowed">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Allowed Public Keys</CardTitle>
                      <Button size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Allow User
                      </Button>
                    </div>
                    <CardDescription>Users that are explicitly allowed on your relay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-start justify-between border-b pb-4">
                            <div>
                              <div className="font-medium truncate max-w-[300px]">
                                npub1abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">Reason: Trusted contributor</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Allowed on: {new Date().toLocaleDateString()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Ban className="mr-2 h-4 w-4" />
                              Ban User
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div id="event-moderation">
            <h2 className="text-xl font-bold tracking-tight mb-4">Event Moderation</h2>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending Moderation</TabsTrigger>
                <TabsTrigger value="banned">Banned Events</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Events Needing Moderation</CardTitle>
                    <CardDescription>Review and moderate these events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-start justify-between border-b pb-4">
                            <div>
                              <div className="font-medium truncate max-w-[300px]">
                                Event ID: abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">Kind: 1 (Text Note)</div>
                              <div className="text-sm mt-2 p-2 bg-muted rounded-md">
                                This is the content of the event that needs moderation. It might contain text that
                                violates your relay's policies.
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" size="sm" className="w-full">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Allow
                              </Button>
                              <Button variant="outline" size="sm" className="w-full">
                                <Ban className="mr-2 h-4 w-4" />
                                Ban
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="banned">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Banned Events</CardTitle>
                    <CardDescription>Events that have been banned from your relay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-start justify-between border-b pb-4">
                            <div>
                              <div className="font-medium truncate max-w-[300px]">
                                Event ID: abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Banned for: Violates content policy
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Banned on: {new Date().toLocaleDateString()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Allow Event
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div id="relay-config">
            <h2 className="text-xl font-bold tracking-tight mb-4">Relay Configuration</h2>
            <Card>
              <CardHeader>
                <CardTitle>Relay Information</CardTitle>
                <CardDescription>Update your relay's basic information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <label className="text-sm font-medium leading-none" htmlFor="relay-name">
                      Relay Name
                    </label>
                    <div className="flex items-center gap-2">
                      <Input id="relay-name" defaultValue="My NOSTR Relay" />
                      <Button size="sm">Update</Button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium leading-none" htmlFor="relay-description">
                      Relay Description
                    </label>
                    <div className="flex items-center gap-2">
                      <Input id="relay-description" defaultValue="A public NOSTR relay for general use" />
                      <Button size="sm">Update</Button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium leading-none" htmlFor="relay-icon">
                      Relay Icon URL
                    </label>
                    <div className="flex items-center gap-2">
                      <Input id="relay-icon" defaultValue="https://example.com/icon.png" />
                      <Button size="sm">Update</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div id="content-policy">
            <h2 className="text-xl font-bold tracking-tight mb-4">Content Policy</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Allowed Event Kinds</CardTitle>
                  <Button size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Add Kind
                  </Button>
                </div>
                <CardDescription>Control which event kinds are allowed on your relay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { kind: 0, name: "Metadata" },
                    { kind: 1, name: "Text Note" },
                    { kind: 2, name: "Recommend Relay" },
                    { kind: 3, name: "Contacts" },
                    { kind: 4, name: "Direct Message" },
                    { kind: 5, name: "Event Deletion" },
                    { kind: 6, name: "Repost" },
                    { kind: 7, name: "Reaction" },
                    { kind: 40, name: "Channel Creation" },
                    { kind: 41, name: "Channel Metadata" },
                    { kind: 42, name: "Channel Message" },
                    { kind: 43, name: "Channel Hide Message" },
                  ].map((kind) => (
                    <div key={kind.kind} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{kind.name}</div>
                        <div className="text-sm text-muted-foreground">Kind: {kind.kind}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div id="security">
            <h2 className="text-xl font-bold tracking-tight mb-4">Security</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Blocked IP Addresses</CardTitle>
                  <Button size="sm">
                    <WifiOff className="mr-2 h-4 w-4" />
                    Block IP
                  </Button>
                </div>
                <CardDescription>Manage IP addresses that are blocked from accessing your relay</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start justify-between border-b pb-4">
                        <div>
                          <div className="font-medium">192.168.1.{i}</div>
                          <div className="text-sm text-muted-foreground mt-1">Reason: Excessive requests</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Blocked on: {new Date().toLocaleDateString()}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Wifi className="mr-2 h-4 w-4" />
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
