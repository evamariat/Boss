// src/app/api/tokens/route.ts
import { supabaseServer } from "@/database/db";
import { getTokenUsage } from "@/database/usage";
import { ensureUserQuota } from "@/database/quotas";

export async function GET() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = user.id;

  // Ensure quota row exists
  const quota = await ensureUserQuota(userId);

  // Fetch usage + limits
  const usage = await getTokenUsage(userId);

  const tokensLeftDaily = usage.dailyLimit - usage.dailyUsed;
  const tokensLeftMonthly = usage.monthlyLimit - usage.monthlyUsed;

  return Response.json({
    dailyUsed: usage.dailyUsed,
    monthlyUsed: usage.monthlyUsed,
    dailyLimit: usage.dailyLimit,
    monthlyLimit: usage.monthlyLimit,
    tokensLeftDaily,
    tokensLeftMonthly,
  });
}
