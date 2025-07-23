"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Connector from "@/components/connector"

export default function SetupPage() {
  const router = useRouter()

  // Check if user already has a relay configured - if yes, redirect to dashboard
  useEffect(() => {
    const savedRelayUrl = localStorage.getItem("relayUrl")
    if (savedRelayUrl) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <Connector />
  )
}