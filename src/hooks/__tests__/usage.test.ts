import { addTokenUsage } from "../usage";
import { vi } from "vitest";

describe("addTokenUsage", () => {
  test("calls Supabase RPCs", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: null });

    vi.mock("../db", () => ({
      supabaseServer: () => ({ rpc }),
    }));

    await addTokenUsage("user123", 50);

    expect(rpc).toHaveBeenCalledTimes(2);
  });
});
