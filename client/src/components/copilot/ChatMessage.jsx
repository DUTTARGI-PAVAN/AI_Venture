import React from 'react';
import '../styles/copilot.css';

const ChatMessage = ({ message, isUser, timestamp }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        <p>{message}</p>
        {timestamp && <span className="message-timestamp">{timestamp}</span>}
      </div>
    </div>
  );
};

export default ChatMessage;
