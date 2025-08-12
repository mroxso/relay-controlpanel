"use client"

import { User, Loader2 } from "lucide-react"
import { UserMetadata, getDisplayName } from "@/lib/user-metadata"

interface UserDisplayProps {
  pubkey: string
  metadata: UserMetadata | null
  isLoading: boolean
  showPubkey?: boolean
  className?: string
}

/**
 * Component to display user information with username and pubkey
 */
export function UserDisplay({ 
  pubkey, 
  metadata, 
  isLoading, 
  showPubkey = true,
  className = ""
}: UserDisplayProps) {
  const displayName = getDisplayName(metadata, pubkey)
  const isShowingUsername = metadata && (metadata.display_name || metadata.name)
  
  return (
    <div className={`flex items-start space-x-2 ${className}`}>
      <div className="flex-shrink-0 mt-1">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        {/* Display name or pubkey */}
        <div className={`${isShowingUsername ? 'font-medium' : 'font-mono text-sm'} break-all`}>
          {displayName}
        </div>
        
        {/* Show pubkey if we're displaying username */}
        {isShowingUsername && showPubkey && (
          <div className="font-mono text-xs text-muted-foreground break-all mt-1">
            {pubkey}
          </div>
        )}
        
        {/* Show additional metadata if available */}
        {metadata?.nip05 && (
          <div className="text-xs text-muted-foreground mt-1">
            ✓ {metadata.nip05}
          </div>
        )}
      </div>
    </div>
  )
}

interface UserDisplayWithReasonProps extends UserDisplayProps {
  reason?: string
}

/**
 * Component to display user information with optional reason
 */
export function UserDisplayWithReason({ 
  reason, 
  ...userDisplayProps 
}: UserDisplayWithReasonProps) {
  return (
    <div className="space-y-1">
      <UserDisplay {...userDisplayProps} />
      {reason && (
        <div className="text-sm text-muted-foreground pl-6">
          Reason: {reason}
        </div>
      )}
    </div>
  )
}