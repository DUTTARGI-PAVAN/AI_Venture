import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import SidebarNavigation from "../components/layout/SidebarNavigation";
import TopNavbar from "../components/layout/TopNavbar";

import ChatMessage from "../components/copilot/ChatMessage";
import ChatInput from "../components/copilot/ChatInput";
import TypingIndicator from "../components/copilot/TypingIndicator";
import SuggestedPrompts from "../components/copilot/SuggestedPrompts";
import EmptyChat from "../components/copilot/EmptyChat";


import {
  getChat,
  sendMessage,
} from "../services/copilotService";

import useStudioStore from "../store/useStudioStore";

export default function CopilotPage() {
  const { projectId } = useParams();

  const { user, logout } = useStudioStore();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    loadChat();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function loadChat() {
    const data = await getChat(projectId);
    setMessages(data.messages);
  }

  async function handleSend(question) {
    setLoading(true);

    const data = await sendMessage(projectId, question);

    setMessages(data.messages);

    setLoading(false);
  }

  async function handleSend(question) {
    console.log("Question:", question);

    setLoading(true);

    try {
      const data = await sendMessage(projectId, question);

      console.log(data);

      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <SidebarNavigation />

      <main className="main-content">

        <TopNavbar
          user={user}
          onLogout={logout}
        />

        <div className="copilot-page">

          <h1>🤖 AI Startup Copilot</h1>

          {messages.length === 0 && (
            <>
              <EmptyChat />

              <SuggestedPrompts
                onSelect={handleSend}
              />
            </>
          )}

          <div className="chat-container">

            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg}
              />
            ))}

            {loading && <TypingIndicator />}

            <div ref={bottomRef} />

          </div>

          <ChatInput
            loading={loading}
            onSend={handleSend}
          />

        </div>

      </main>
    </div>
  );
}