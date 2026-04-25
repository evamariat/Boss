import { POST } from "../route";
import { vi } from "vitest";

describe("POST /api/chat", () => {
  test("returns a streaming response", async () => {
    // Mock OpenAI streaming
    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: "Hello" } }] };
        yield { choices: [{ delta: { content: " world" } }] };
      },
    };

    vi.mock("@/lib/openai", () => ({
      openai: {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue(mockStream),
          },
        },
      },
    }));

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ messages: [] }),
    });

    const res = await POST(req);

    expect(res.body).toBeDefined();
  });
});
