"use client";

import { useState, useRef } from "react";
import { useTokenStore } from "@/lib/store/tokens";

export function useStreamChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything." },
  ]);

  const { refresh } = useTokenStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  async function sendMessage(userMessage: string) {
    // Add user message + empty assistant placeholder
    const newMessages = [
      ...messages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ];

    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    let assistantText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      assistantText += decoder.decode(value);

      // Update assistant message as it streams
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = assistantText;
        return updated;
      });

      // Auto-scroll
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    // Refresh token badge after streaming finishes
    refresh();
  }

  return {
    messages,
    sendMessage,
    scrollRef,
  };
}
