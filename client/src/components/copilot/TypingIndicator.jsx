import React from 'react';
import '../styles/copilot.css';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <span className="typing-text">Copilot is thinking...</span>
    </div>
  );
};

export default TypingIndicator;
