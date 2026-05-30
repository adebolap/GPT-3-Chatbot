export const webEnv = {
  appUrl: process.env.APP_URL || "http://localhost:3000",
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY || "",
  lemonSqueezyCheckoutUrl: process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "",
  lemonSqueezyWebhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ""
}

export const getWebEnvStatus = () => ({
  clerk: Boolean(webEnv.clerkPublishableKey && webEnv.clerkSecretKey),
  lemonSqueezyCheckout: Boolean(webEnv.lemonSqueezyCheckoutUrl),
  lemonSqueezyWebhook: Boolean(webEnv.lemonSqueezyWebhookSecret),
  supabase: Boolean(webEnv.supabaseUrl && webEnv.supabaseServiceRoleKey)
})
