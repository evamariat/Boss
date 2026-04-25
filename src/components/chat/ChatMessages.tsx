export function ChatMessages({ messages }) {
  return (
    <div className="space-y-4">
      {messages.map((m, i) => (
        <div
          key={i}
          className={
            m.role === "user"
              ? "text-right"
              : "text-left"
          }
        >
          <div
            className={
              m.role === "user"
                ? "inline-block bg-blue-600 text-white px-3 py-2 rounded-lg"
                : "inline-block bg-gray-200 text-black px-3 py-2 rounded-lg"
            }
          >
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}
