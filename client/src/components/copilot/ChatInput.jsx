import { useState } from "react";

export default function ChatInput({
  onSend,
  loading,
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;

    onSend(text);

    setText("");
  };

  return (
    <div className="chat-input">

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask your AI Startup Copilot..."
        onKeyDown={(e) =>
          e.key === "Enter" && submit()
        }
      />

      <button
        onClick={submit}
        disabled={loading}
      >
        {loading ? "..." : "Send"}
      </button>

    </div>
  );
}