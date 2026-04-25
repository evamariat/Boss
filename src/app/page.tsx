import { TokensBadge } from "@/components/tokens-badge";
import { Chat } from "@/components/chat/Chat";

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6 min-h-screen">

      {/* Column 1 — Video */}
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

      {/* Column 2 — Token Badge */}
      <div className="flex items-start justify-center relative">
        <TokensBadge />
      </div>

      {/* Column 3 — Chat */}
      <div className="border rounded-lg p-4 shadow-sm h-[80vh]">
        <h2 className="font-semibold mb-2">Chat</h2>
        <Chat />
      </div>

    </div>
  );
}
