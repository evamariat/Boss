import { supabaseServer } from "@/database/db";
import { addTokenUsage, getTokenUsage } from "@/database/usage";
import { ensureUserQuota } from "@/database/quotas";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Not authenticated", { status: 401 });
  }

  const userId = user.id;
  const { messages } = await req.json();

  // Create a streaming OpenAI response
  const stream = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages,
    stream: true,
  });

  // We accumulate tokens as they stream
  let totalTokens = 0;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices?.[0]?.delta?.content || "";

        // Count tokens (OpenAI returns usage only at end, so we approximate)
        totalTokens += text.split(/\s+/).length;

        controller.enqueue(encoder.encode(text));
      }

      controller.close();

      // After streaming finishes → update usage in Supabase
      try {
        await addTokenUsage(userId, totalTokens);
        await ensureUserQuota(userId);
      } catch (err) {
        console.error("Usage update failed:", err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
