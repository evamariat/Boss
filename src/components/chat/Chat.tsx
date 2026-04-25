"use client";

import { useState, useRef } from "react";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useTokenStore } from "@/lib/store/tokens";

export function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything." },
  ]);

  const { refresh } = useTokenStore();
  const containerRef = useRef<HTMLDivElement>(null);

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

      assistantText += decoder.decode(value);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = assistantText;
        return updated;
      });

      // Auto-scroll
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    // Refresh token badge after streaming finishes
    refresh();
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto border rounded-lg p-4 bg-white"
      >
        <ChatMessages messages={messages} />
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
