"use client"

import NDK, { NDKFilter } from "@nostr-dev-kit/ndk"

export interface UserMetadata {
  name?: string
  display_name?: string
  about?: string
  picture?: string
  nip05?: string
  pubkey: string
}

// Cache for storing fetched metadata
const metadataCache = new Map<string, UserMetadata | null>()

/**
 * Fetch user metadata (NIP-01 kind:0 event) for a given pubkey
 * @param pubkey - The public key to fetch metadata for
 * @param ndk - NDK instance for making requests
 * @returns UserMetadata object or null if not found
 */
export async function fetchUserMetadata(pubkey: string, ndk: NDK): Promise<UserMetadata | null> {
  // Check cache first
  if (metadataCache.has(pubkey)) {
    return metadataCache.get(pubkey) || null
  }

  try {
    // Create filter for kind:0 events by this pubkey
    const filter: NDKFilter = {
      kinds: [0],
      authors: [pubkey],
      limit: 1
    }

    // Fetch the most recent metadata event
    const events = await ndk.fetchEvents(filter)
    
    if (events.size === 0) {
      // No metadata found, cache null result
      metadataCache.set(pubkey, null)
      return null
    }

    // Get the most recent event (should be only one due to limit:1)
    const event = Array.from(events)[0]
    
    try {
      // Parse the JSON content
      const metadata = JSON.parse(event.content) as Partial<UserMetadata>
      
      const userMetadata: UserMetadata = {
        ...metadata,
        pubkey
      }
      
      // Cache the result
      metadataCache.set(pubkey, userMetadata)
      
      return userMetadata
    } catch (parseError) {
      console.error('Failed to parse metadata JSON for pubkey:', pubkey, parseError)
      metadataCache.set(pubkey, null)
      return null
    }
  } catch (error) {
    console.error('Failed to fetch metadata for pubkey:', pubkey, error)
    metadataCache.set(pubkey, null)
    return null
  }
}

/**
 * Get display name for a user, with fallback to pubkey
 * @param metadata - UserMetadata object or null
 * @param pubkey - The pubkey as fallback
 * @returns Display name string
 */
export function getDisplayName(metadata: UserMetadata | null, pubkey: string): string {
  if (!metadata) {
    return pubkey
  }
  
  // Prefer display_name, then name, then fallback to pubkey
  return metadata.display_name || metadata.name || pubkey
}

/**
 * Clear the metadata cache (useful for refreshing data)
 */
export function clearMetadataCache(): void {
  metadataCache.clear()
}

/**
 * Get cached metadata without making a network request
 * @param pubkey - The public key to get cached metadata for
 * @returns Cached UserMetadata or undefined if not cached
 */
export function getCachedMetadata(pubkey: string): UserMetadata | null | undefined {
  return metadataCache.get(pubkey)
}