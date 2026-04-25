// src/database/usage.ts
import { supabaseServer } from "./db";

export async function addTokenUsage(userId: string, tokens: number) {
  const supabase = supabaseServer();

  // Daily
  const { error: dailyError } = await supabase.rpc(
    "increment_daily_usage",
    {
      p_user_id: userId,
      p_tokens: tokens,
    }
  );

  if (dailyError) {
    console.error("Daily usage RPC error:", dailyError);
    throw dailyError;
  }

  // Monthly
  const { error: monthlyError } = await supabase.rpc(
    "increment_monthly_usage",
    {
      p_user_id: userId,
      p_tokens: tokens,
    }
  );

  if (monthlyError) {
    console.error("Monthly usage RPC error:", monthlyError);
    throw monthlyError;
  }
}

export async function getTokenUsage(userId: string) {
  const supabase = supabaseServer();

  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const { data: daily } = await supabase
    .from("token_usage_daily")
    .select("tokens_used")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  const { data: monthly } = await supabase
    .from("token_usage_monthly")
    .select("tokens_used")
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year)
    .single();

  const { data: quota } = await supabase
    .from("token_quotas")
    .select("*")
    .eq("user_id", userId)
    .single();

  return {
    dailyUsed: daily?.tokens_used ?? 0,
    monthlyUsed: monthly?.tokens_used ?? 0,
    dailyLimit: quota?.daily_limit ?? 0,
    monthlyLimit: quota?.monthly_limit ?? 0,
  };
}
