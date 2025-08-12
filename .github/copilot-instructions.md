# Copilot Instructions for NOSTR Relay Control Panel

## Project Overview

This is a **NOSTR Relay Control Panel** - a Next.js web application that provides a user-friendly interface for managing NOSTR relays through the NIP-86 Relay Management API specification. NOSTR (Notes and Other Stuff Transmitted by Relays) is a decentralized social media protocol.

## Key Technologies & Architecture

- **Framework**: Next.js 15.3.1 with App Router
- **Language**: TypeScript
- **UI**: React 19 with Tailwind CSS and shadcn/ui components
- **NOSTR Libraries**: 
  - `@nostr-dev-kit/ndk` for NOSTR Development Kit functionality
  - `nostr-tools` for low-level NOSTR protocol operations
- **Authentication**: NIP-98 (HTTP Auth) for secure API authorization
- **API Specification**: NIP-86 Relay Management API

## Project Structure

```
/app/                 # Next.js App Router pages
  /dashboard/         # Main control panel interface
  /setup/            # Initial setup and configuration
  layout.tsx         # Root layout with navigation
  page.tsx           # Landing page
/components/
  /ui/               # Reusable UI components (shadcn/ui based)
  connector.tsx      # NOSTR connection and authentication logic
/lib/
  utils.ts           # Utility functions and helpers
```

## Domain Knowledge: NOSTR Protocol

### Key Concepts
- **Events**: All data in NOSTR is represented as signed JSON events
- **Public Keys**: Used to identify users and authenticate actions
- **Relays**: Servers that store and distribute NOSTR events
- **NIPs**: NOSTR Implementation Possibilities - specifications for protocol features

### NIP-86 Relay Management API Methods
The application implements these relay management operations:

**User Management:**
- `banpubkey` / `allowpubkey` - Control user access by public key
- `listbannedpubkeys` / `listallowedpubkeys` - View user access lists

**Event Moderation:**
- `listeventsneedingmoderation` - Get events requiring review
- `allowevent` / `banevent` - Approve or reject specific events
- `listbannedevents` - View rejected events

**Relay Configuration:**
- `changerelayname` / `changerelaydescription` / `changerelayicon` - Update relay metadata

**Content Policy:**
- `allowkind` / `disallowkind` - Control which event types are permitted
- `listallowedkinds` - View permitted event types

**Security:**
- `blockip` / `unblockip` - IP address management
- `listblockedips` - View blocked IPs

## Coding Standards & Conventions

### TypeScript
- Use strict TypeScript configuration
- Prefer explicit typing over `any`
- Use proper interfaces for NOSTR event structures and API responses
- Follow Next.js TypeScript conventions

### React Components
- Use functional components with hooks
- Prefer composition over inheritance
- Use proper component naming (PascalCase)
- Keep components focused and single-responsibility

### Styling
- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Use CSS variables for theming (dark/light mode support)
- Responsive design with mobile-first approach

### File Naming
- Use kebab-case for directories
- Use PascalCase for React components
- Use camelCase for utility functions and hooks
- Use descriptive, domain-specific names

### API Integration
- All relay management API calls should use proper NIP-98 authentication
- Handle async operations with proper error handling
- Use TypeScript interfaces for API request/response types
- Implement proper loading states and error boundaries

## Development Patterns

### NOSTR Event Handling
```typescript
// Always validate event signatures and structure
interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}
```

### Relay Management API Calls
```typescript
// Use proper authentication headers for NIP-86 API
const makeRelayRequest = async (method: string, params: any) => {
  // Include NIP-98 auth header
  // Handle relay-specific responses
  // Provide proper error handling
}
```

### Component Structure
- Use shadcn/ui components as building blocks
- Implement proper form validation
- Use React Hook Form for complex forms
- Implement proper accessibility (ARIA labels, keyboard navigation)

## Testing Approach
- Focus on critical user flows (authentication, relay configuration)
- Test NOSTR event validation and API integration
- Ensure responsive design works across devices
- Test error handling for network failures and invalid responses

## Security Considerations
- Always validate NOSTR event signatures
- Implement proper authentication with NIP-98
- Sanitize user inputs, especially when displaying event content
- Use HTTPS for all relay communications
- Handle private keys securely (never log or expose them)

## Performance Guidelines
- Lazy load dashboard components
- Implement proper caching for relay metadata
- Use React.memo for expensive components
- Optimize bundle size by code splitting

## Common Patterns to Follow

1. **NOSTR Connection Management**: Use the connector component for authentication
2. **API Error Handling**: Provide user-friendly error messages for relay connection issues
3. **Form Validation**: Validate public keys, relay URLs, and other NOSTR-specific data formats
4. **Loading States**: Show appropriate spinners/skeletons during API calls
5. **Responsive Design**: Ensure all components work on mobile and desktop

## Avoid These Patterns

1. Don't hardcode relay URLs - make them configurable
2. Don't store private keys in localStorage without encryption
3. Don't bypass NOSTR event signature validation
4. Don't create overly complex component hierarchies
5. Don't ignore accessibility requirements

## Dependencies Usage

- **@nostr-dev-kit/ndk**: Use for high-level NOSTR operations and relay management
- **nostr-tools**: Use for low-level cryptographic operations and event validation
- **@radix-ui/***: Base components for building accessible UI
- **lucide-react**: Icons that match the design system
- **next-themes**: Theme management for dark/light mode

When working on this project, always consider the NOSTR protocol specifications and ensure that any relay management operations follow the NIP-86 standard.