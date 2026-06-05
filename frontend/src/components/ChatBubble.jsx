import React from 'react';
import '../styles/Components.css';

const ChatBubble = ({ message, sender }) => {
  // sender will be either 'user' or 'ai'
  return (
    <div className={`message ${sender}`}>
      <p className="message-text">{message}</p>
      <span className="message-time">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default ChatBubble;