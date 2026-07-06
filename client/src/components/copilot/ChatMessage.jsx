import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`chat-message ${isUser ? "user" : "assistant"}`}>
      <div className="chat-avatar">
        {isUser ? "👤" : "🤖"}
      </div>

      <div className="chat-bubble">
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}