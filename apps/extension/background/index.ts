import { createClerkClient } from "@clerk/chrome-extension/background"

const CLERK_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""

if (CLERK_KEY) {
  createClerkClient({ publishableKey: CLERK_KEY })
}
