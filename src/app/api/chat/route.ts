// app/api/chat/route.ts
import { supabaseServer } from "@/database/db";
import { addTokenUsage, getTokenUsage } from "@/database/usage";
import { ensureUserQuota } from "@/database/quotas";
import { openai } from "@/lib/openai"; // your OpenAI client

export async function POST(req: Request) {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = user.id;
  const { messages } = await req.json();

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages,
  });

  const tokensUsed = completion.usage.total_tokens;

  // Update usage
  await addTokenUsage(userId, tokensUsed);

  // Ensure quota exists
  await ensureUserQuota(userId);

  // Fetch usage + limits
  const usage = await getTokenUsage(userId);

  const tokensLeftDaily = usage.dailyLimit - usage.dailyUsed;
  const tokensLeftMonthly = usage.monthlyLimit - usage.monthlyUsed;

  return Response.json({
    message: completion.choices[0].message,
    tokensLeftDaily,
    tokensLeftMonthly,
  });
}
