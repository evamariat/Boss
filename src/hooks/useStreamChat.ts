"use client";

import { useState, useRef } from "react";
import { useTokenStore } from "@/lib/store/tokens";
import { useTTS } from "./useTTS";

export function useStreamChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything." },
  ]);

  const { refresh } = useTokenStore();
  const { speak } = useTTS();
  const scrollRef = useRef<HTMLDivElement>(null);

  async function sendMessage(userMessage: string) {
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

      const chunk = decoder.decode(value);
      assistantText += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = assistantText;
        return updated;
      });

      // Speak the chunk
      speak(chunk);

      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    refresh();
  }

  return {
    messages,
    sendMessage,
    scrollRef,
  };
}
