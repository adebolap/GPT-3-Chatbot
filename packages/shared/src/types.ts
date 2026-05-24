export type RefinementMode =
  | "default"
  | "professional"
  | "accuracy-first"
  | "technical-coding"
  | "marketing"
  | "shorter"
  | "deep-research"

export type DetectedIntent = "coding" | "research" | "writing" | "analysis" | "general"
export type Confidence = "high" | "medium" | "low"
export type SubscriptionStatus = "free" | "active" | "canceled" | "past_due"
export type Plan = "free" | "pro"

export interface RefineRequest {
  prompt: string
  mode: RefinementMode
}

export interface RefineResponse {
  refinedPrompt: string
  detectedIntent: DetectedIntent
  missingContext: string[]
  confidence: Confidence
}

export interface UserProfile {
  id: string
  email: string
  subscription_status: SubscriptionStatus
  plan: Plan
}

export interface UsageInfo {
  month: string
  refinement_count: number
  free_limit: number
}
