"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoice } from "@/hooks/useVoice";

export function ChatInput({ onSend }) {
  const [value, setValue] = useState("");
  const { isListening, transcript, startListening, stopListening, setTranscript } =
    useVoice();

  // When transcript updates, sync to input
  if (transcript && transcript !== value) {
    setValue(transcript);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;

    onSend(value);
    setValue("");
    setTranscript("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Speak or type…"
      />

      <Button
        type="button"
        variant={isListening ? "destructive" : "secondary"}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? "Stop" : "🎤"}
      </Button>

      <Button type="submit">Send</Button>
    </form>
  );
}
