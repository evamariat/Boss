import { create } from "zustand";

export const useTokenStore = create((set) => ({
  tokensLeftDaily: null,
  tokensLeftMonthly: null,
  refresh: async () => {
    const res = await fetch("/api/tokens");
    const data = await res.json();
    set({
      tokensLeftDaily: data.tokensLeftDaily,
      tokensLeftMonthly: data.tokensLeftMonthly,
    });
  },
}));
