"use client";

export function useTTS() {
  function speak(text: string) {
    if (!window.speechSynthesis) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(utter);
  }

  return { speak };
}
