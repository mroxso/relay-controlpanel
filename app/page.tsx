import Link from "next/link"
import { ArrowRight, Shield, Users, FileText, Settings, Server, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6" />
            <span className="text-lg font-bold">NOSTR Relay Manager</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#api" className="text-sm font-medium hover:underline underline-offset-4">
              API
            </Link>
          </nav>
          <div>
            <Button asChild>
              <Link href="/dashboard">Control Panel</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Manage Your NOSTR Relay with Confidence
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A powerful control panel for NOSTR relay administrators implementing the NIP-86 Relay Management API
                  specification.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Access Control Panel <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Link href="#api">Learn About NIP-86</Link>
                  </Button>
                </div>
              </div>
              {/* <div className="mx-auto lg:ml-auto">
                <Image
                  src="/nostr-relay-dashboard.png"
                  alt="NOSTR Relay Dashboard"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover shadow-md"
                  priority
                />
              </div> */}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2 max-w-[800px] mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Management Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to effectively manage your NOSTR relay in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-8 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">User Management</h3>
                <p className="text-muted-foreground">
                  Ban or allow specific public keys with detailed tracking and management.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Event Moderation</h3>
                <p className="text-muted-foreground">
                  Review, allow, or ban events with a streamlined moderation workflow.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Relay Configuration</h3>
                <p className="text-muted-foreground">Easily update your relay&apos;s name, description, and icon.</p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Content Policy</h3>
                <p className="text-muted-foreground">Control which event kinds are allowed on your relay.</p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Security Controls</h3>
                <p className="text-muted-foreground">Block problematic IP addresses and manage security settings.</p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">API Integration</h3>
                <p className="text-muted-foreground">
                  Full implementation of the NIP-86 Relay Management API specification.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2 max-w-[800px] mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our control panel implements the NIP-86 Relay Management API specification.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-8">
              {/* <div className="mx-auto order-2 lg:order-1">
                <Image
                  src="/nostr-relay-api-workflow.png"
                  alt="How NOSTR Relay Management Works"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover shadow-md"
                />
              </div> */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Secure Authentication</h3>
                  <p className="text-muted-foreground">
                    Uses NIP-98 for secure authorization with signed events containing the relay URL.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">JSON-RPC Style API</h3>
                  <p className="text-muted-foreground">
                    Simple request-response protocol over HTTP on the same URI as your relay&apos;s websocket.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Comprehensive Methods</h3>
                  <p className="text-muted-foreground">
                    Supports all NIP-86 methods from user management to relay configuration.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Intuitive Interface</h3>
                  <p className="text-muted-foreground">
                    Our control panel makes these powerful API features accessible through a user-friendly interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="api" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2 max-w-[800px] mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">NIP-86 API Reference</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The Relay Management API specification our control panel implements.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-8">
              <div className="rounded-lg border bg-card p-8 shadow-md">
                <h3 className="text-xl font-bold mb-6">API Methods</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md hover:shadow-sm transition-shadow">
                      <h4 className="font-medium">User Management</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                        <li>banpubkey</li>
                        <li>listbannedpubkeys</li>
                        <li>allowpubkey</li>
                        <li>listallowedpubkeys</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-md hover:shadow-sm transition-shadow">
                      <h4 className="font-medium">Event Moderation</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                        <li>listeventsneedingmoderation</li>
                        <li>allowevent</li>
                        <li>banevent</li>
                        <li>listbannedevents</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-md hover:shadow-sm transition-shadow">
                      <h4 className="font-medium">Relay Configuration</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                        <li>changerelayname</li>
                        <li>changerelaydescription</li>
                        <li>changerelayicon</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-md hover:shadow-sm transition-shadow">
                      <h4 className="font-medium">Content & Security</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                        <li>allowkind / disallowkind</li>
                        <li>listallowedkinds</li>
                        <li>blockip / unblockip</li>
                        <li>listblockedips</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <Button asChild size="lg">
                      <Link href="/dashboard">
                        Access Control Panel <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6 mx-auto">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NOSTR Relay Manager. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link
              href="https://github.com/nostr-protocol/nips/blob/master/86.md"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              NIP-86 Spec
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
