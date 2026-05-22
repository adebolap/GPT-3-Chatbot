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
