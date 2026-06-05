import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Navbar from './components/Navbar';
import ActionCard from './components/ActionCard';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';

import About from './pages/about';
import Contact from './pages/contact';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ApsCalculator from './pages/ApsCalculator';

import { BookOpen, Briefcase, GraduationCap, Info } from 'lucide-react';
import './styles/global.css';
import './styles/ChatPage.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your BC CourseFinder. How can I help you today?", sender: "ai" }
  ]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    const userMsg = { text, sender: "user" };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        message: text
      });

      const aiMsg = { text: response.data.reply, sender: "ai" };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now.", 
        sender: "ai" 
      }]);
    }
  };

  return (
    <Router>
      <div className="container">
        <Navbar />

        <Routes>
          <Route path="/" element={
            <>
              <header className="header-section">
                <h1>BC CourseFinder™</h1>
                <p>Your AI-driven career guidance partner.</p>
              </header>

              <section className="action-grid">
                <ActionCard 
                  title="Careers" 
                  icon={<Briefcase size={24} />} 
                  onClick={() => handleSendMessage("What careers can I study with my subjects?")} 
                />
                <ActionCard 
                  title="Qualifications" 
                  icon={<GraduationCap size={24} />} 
                  onClick={() => handleSendMessage("What is the difference between a diploma and a degree?")} 
                />
                <ActionCard 
                  title="Requirements" 
                  icon={<BookOpen size={24} />} 
                  onClick={() => handleSendMessage("What are the admission requirements?")} 
                />
                <ActionCard 
                  title="About BC" 
                  icon={<Info size={24} />} 
                  onClick={() => handleSendMessage("Tell me more about Belgium Campus.")} 
                />
              </section>

              <main className="chat-window">
                {messages.map((msg, index) => (
                  <ChatBubble key={index} message={msg.text} sender={msg.sender} />
                ))}
                <div ref={chatEndRef} />
              </main>

              <ChatInput onSendMessage={handleSendMessage} />
            </>
          } />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aps" element={<ApsCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;