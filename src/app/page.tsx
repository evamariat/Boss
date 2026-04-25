// src/app/page.tsx
import { TokensBadge } from "@/components/tokens-badge";

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6 min-h-screen">

      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Video</h2>
        <div className="aspect-video rounded overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video"
            allowFullScreen
          />
        </div>
      </div>

      <div className="flex items-start justify-center relative">
        <TokensBadge />
      </div>

      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Chat Simulation</h2>
        <div className="text-sm text-muted-foreground">
          (Your chat UI goes here)
        </div>
      </div>

    </div>
  );
}
