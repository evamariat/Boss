import { renderHook, act } from "@testing-library/react";
import { useStreamChat } from "../useStreamChat";
import { vi } from "vitest";

describe("useStreamChat", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("streams assistant messages", async () => {
    // Mock streaming response
    const encoder = new TextEncoder();
    const chunks = ["Hello", " world"];

    global.fetch = vi.fn().mockResolvedValue({
      body: {
        getReader() {
          let i = 0;
          return {
            read() {
              if (i < chunks.length) {
                return Promise.resolve({
                  value: encoder.encode(chunks[i++]),
                  done: false,
                });
              }
              return Promise.resolve({ done: true });
            },
          };
        },
      },
    });

    const { result } = renderHook(() => useStreamChat());

    await act(async () => {
      await result.current.sendMessage("Hi");
    });

    const last = result.current.messages.at(-1);
    expect(last.content).toBe("Hello world");
  });
});
