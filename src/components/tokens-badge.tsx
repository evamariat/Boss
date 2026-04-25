// components/tokens-badge.tsx
"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useTokenStore } from "@/lib/store/tokens";

export function TokensBadge() {
  const { tokensLeftDaily, refresh } = useTokenStore();

  useEffect(() => {
    refresh();
  }, []);

  if (tokensLeftDaily == null) return null;

  return (
    <Badge
      variant="secondary"
      className="fixed bottom-4 right-4 shadow-md px-3 py-1 text-sm"
    >
      {tokensLeftDaily.toLocaleString()} tokens left today
    </Badge>
  );
}
