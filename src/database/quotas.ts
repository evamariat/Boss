// src/database/quotas.ts
import { supabaseServer } from "./db";

export async function getUserQuota(userId: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("token_quotas")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function ensureUserQuota(userId: string) {
  const supabase = supabaseServer();

  // Try to fetch existing quota
  const existing = await getUserQuota(userId);
  if (existing) return existing;

  // Create default quota row
  const { data, error } = await supabase
    .from("token_quotas")
    .insert({
      user_id: userId,
      daily_limit: 50000,
      monthly_limit: 1000000,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserQuota(
  userId: string,
  dailyLimit: number,
  monthlyLimit: number
) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("token_quotas")
    .update({
      daily_limit: dailyLimit,
      monthly_limit: monthlyLimit,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
