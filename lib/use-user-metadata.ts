"use client"

import { useState, useEffect, useMemo } from "react"
import NDK from "@nostr-dev-kit/ndk"
import { UserMetadata, fetchUserMetadata, getCachedMetadata } from "./user-metadata"

interface UseUserMetadataResult {
  metadata: UserMetadata | null
  isLoading: boolean
  error: string | null
}

/**
 * React hook to fetch and manage user metadata for a pubkey
 * @param pubkey - The public key to fetch metadata for
 * @param ndk - NDK instance for making requests
 * @returns Object with metadata, loading state, and error
 */
export function useUserMetadata(pubkey: string, ndk: NDK | null): UseUserMetadataResult {
  const [metadata, setMetadata] = useState<UserMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!pubkey || !ndk) {
      setMetadata(null)
      setIsLoading(false)
      setError(null)
      return
    }

    // Check if we have cached data
    const cached = getCachedMetadata(pubkey)
    if (cached !== undefined) {
      setMetadata(cached)
      setIsLoading(false)
      setError(null)
      return
    }

    // Fetch metadata if not cached
    setIsLoading(true)
    setError(null)
    
    fetchUserMetadata(pubkey, ndk)
      .then((result) => {
        setMetadata(result)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch metadata')
        setMetadata(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [pubkey, ndk])

  return { metadata, isLoading, error }
}

/**
 * React hook to fetch metadata for multiple pubkeys
 * @param pubkeys - Array of public keys to fetch metadata for
 * @param ndk - NDK instance for making requests
 * @returns Map of pubkey to metadata result
 */
export function useMultipleUserMetadata(pubkeys: string[], ndk: NDK | null): Map<string, UseUserMetadataResult> {
  const [results, setResults] = useState<Map<string, UseUserMetadataResult>>(new Map())
  
  // Create a stable string representation of pubkeys to prevent infinite loops
  const pubkeysKey = useMemo(() => pubkeys.slice().sort().join(','), [pubkeys])

  useEffect(() => {
    if (!ndk || pubkeys.length === 0) {
      setResults(new Map())
      return
    }

    // Create initial state for all pubkeys
    const initialResults = new Map<string, UseUserMetadataResult>()
    pubkeys.forEach(pubkey => {
      // Check if we already have cached data
      const cached = getCachedMetadata(pubkey)
      if (cached !== undefined) {
        initialResults.set(pubkey, {
          metadata: cached,
          isLoading: false,
          error: null
        })
      } else {
        initialResults.set(pubkey, {
          metadata: null,
          isLoading: true,
          error: null
        })
      }
    })
    
    setResults(initialResults)

    // Fetch metadata for pubkeys that aren't cached
    const pubkeysToFetch = pubkeys.filter(pubkey => getCachedMetadata(pubkey) === undefined)
    
    if (pubkeysToFetch.length === 0) {
      return // All pubkeys are cached, no need to fetch
    }

    // Fetch metadata for uncached pubkeys
    pubkeysToFetch.forEach(async (pubkey) => {
      try {
        const metadata = await fetchUserMetadata(pubkey, ndk)
        setResults(prev => {
          const updated = new Map(prev)
          updated.set(pubkey, {
            metadata,
            isLoading: false,
            error: null
          })
          return updated
        })
      } catch (err) {
        setResults(prev => {
          const updated = new Map(prev)
          updated.set(pubkey, {
            metadata: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch metadata'
          })
          return updated
        })
      }
    })
  }, [pubkeysKey, ndk])

  return results
}