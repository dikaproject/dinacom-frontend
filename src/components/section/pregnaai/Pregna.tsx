// Pregna.tsx
"use client"
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPaperclip, FiImage } from 'react-icons/fi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  sources?: string[]; // Add sources to message interface
}

const PregnaAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKey] = useState('inth_bediuekuefBKUSDWtbDWigU886DSBjkkbh'); // Demo key

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Add typing animation helper
  const typeMessage = (text: string, callback: (typedText: string) => void) => {
    let index = 0;
    const speed = 20; // Typing speed in milliseconds

    const type = () => {
      if (index < text.length) {
        callback(text.slice(0, index + 1));
        index++;
        setTimeout(type, speed);
      }
    };
    type();
  };

  // Modify handleSend to include typing animation and sources
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/v1/health/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          question: newMessage,
          version: 'ITHAI-1.0' // Using demo version
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Create temporary message for typing animation
      const tempBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        status: 'sent',
        sources: data.sources
      };

      setMessages(prev => [...prev, tempBotMessage]);

      // Animate the typing
      typeMessage(data.answer, (typedText) => {
        setMessages(prev => prev.map(msg =>
          msg.id === tempBotMessage.id
            ? { ...msg, text: typedText }
            : msg
        ));
      });

    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Maaf, terjadi kesalahan dalam memproses pesan Anda. Silakan coba lagi.",
        sender: 'bot',
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-6 px-2 sm:pt-28 sm:pb-20 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-6rem)] sm:h-[700px] flex flex-col">
          {/* Chat Header with Disclaimer */}
          <div className="bg-purple-600 text-white px-4 sm:px-6 py-4 flex-none">
            <h1 className="text-lg sm:text-xl font-semibold">PregnaAI Assistant</h1>
            <p className="text-purple-200 text-xs sm:text-sm">Your 24/7 pregnancy companion</p>
            <div className="mt-2 text-xs text-purple-200 border-t border-purple-500 pt-2">
              ⚠️ AI Assistant Disclaimer: Responses are AI-generated and should not replace professional medical advice.
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
            {/* Welcome Message */}
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-4">
              <p className="text-purple-800 text-sm">
                👋 Welcome! I'm your AI pregnancy assistant. While I can provide information and support,
                please remember that I'm not a substitute for professional medical care. Always consult
                with healthcare providers for medical decisions.
              </p>
            </div>

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-sm px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="text-[15px] break-words">{message.text}</p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-medium">Sources:</p>
                        <ul className="mt-1 space-y-1">
                          {message.sources.map((source, index) => (
                            <li key={index} className="text-xs text-gray-500">
                              {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex space-x-2 px-4 py-3 bg-white rounded-2xl shadow-sm w-24"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-purple-600 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 bg-white flex-none">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                  <FiPaperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                  <FiImage className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 min-w-0"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="flex-none bg-purple-600 text-white p-2 rounded-full disabled:opacity-50"
              >
                <FiSend className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnaAI;