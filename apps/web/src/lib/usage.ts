import { supabaseAdmin } from "./supabase-admin"

export const FREE_LIMIT = 10

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

// Authenticated users — usage_events table (linked to users.id)
export async function getAuthUserUsage(userId: string, month: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from("usage_events")
    .select("refinement_count")
    .eq("user_id", userId)
    .eq("month", month)
    .single()
  return data?.refinement_count ?? 0
}

export async function incrementAuthUserUsage(userId: string, month: string): Promise<void> {
  const { data: existing } = await supabaseAdmin
    .from("usage_events")
    .select("id, refinement_count")
    .eq("user_id", userId)
    .eq("month", month)
    .single()

  if (existing) {
    await supabaseAdmin
      .from("usage_events")
      .update({ refinement_count: existing.refinement_count + 1 })
      .eq("id", existing.id)
  } else {
    await supabaseAdmin
      .from("usage_events")
      .insert({ user_id: userId, month, refinement_count: 1 })
  }
}

// Anonymous users — device_usage table (no FK, keyed by device UUID)
// Schema: create table device_usage (device_id text, month text, refinement_count int default 0, primary key (device_id, month));
export async function getDeviceUsage(deviceId: string, month: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from("device_usage")
    .select("refinement_count")
    .eq("device_id", deviceId)
    .eq("month", month)
    .single()
  return data?.refinement_count ?? 0
}

export async function incrementDeviceUsage(deviceId: string, month: string): Promise<void> {
  const count = await getDeviceUsage(deviceId, month)
  await supabaseAdmin
    .from("device_usage")
    .upsert(
      { device_id: deviceId, month, refinement_count: count + 1 },
      { onConflict: "device_id,month" }
    )
}

export async function checkLimit(
  userId: string,
  isAuthenticated: boolean,
  isPro: boolean,
  month: string
): Promise<{ allowed: boolean; count: number }> {
  if (isPro) return { allowed: true, count: 0 }

  const count = isAuthenticated
    ? await getAuthUserUsage(userId, month)
    : await getDeviceUsage(userId, month)

  return { allowed: count < FREE_LIMIT, count }
}
