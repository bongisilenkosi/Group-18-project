import React, { useState } from 'react';
import { Send } from 'lucide-react'; // Modern send icon
import '../styles/ChatPage.css';

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText(''); // Clear input after sending
    }
  };

  return (
    <form className="input-area" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Ask about careers or courses..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="send-btn">
        <Send size={20} color="#003366" />
      </button>
    </form>
  );
};

export default ChatInput;