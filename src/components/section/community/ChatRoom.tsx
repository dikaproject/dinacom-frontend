// ChatRoom.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMoreVertical, FiLogOut, FiArrowLeft } from 'react-icons/fi';

interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  userName: string;
  userAvatar: string;
}

interface Community {
  name: string;
  imageUrl: string;
  memberCount: number;
}

const ChatRoom = ({ community, onLeave, onBack }: { community: Community; onLeave: () => void; onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      userId: 'current-user-id',
      text: newMessage,
      timestamp: new Date(),
      userName: 'Current User',
      userAvatar: '/avatars/default.png'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src={community.imageUrl}
              alt={community.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-800">{community.name}</h2>
              <p className="text-sm text-gray-500">{community.memberCount} members</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <FiMoreVertical className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-800"
              >
                <button
                  onClick={onBack}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to Communities
                </button>
                <button
                  onClick={onLeave}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center border-t border-gray-100"
                >
                  <FiLogOut className="mr-2" />
                  Leave Community
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-[calc(100vh-8rem)] overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.userId === 'current-user-id' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`flex ${
              message.userId === 'current-user-id' ? 'flex-row-reverse' : 'flex-row'
            } items-end space-x-2`}>
              <img
                src={message.userAvatar}
                alt={message.userName}
                className="w-8 h-8 rounded-full"
              />
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.userId === 'current-user-id'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}>
                <p className="text-[15px]">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.userId === 'current-user-id'
                    ? 'text-purple-200'
                    : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 placeholder:text-gray-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-purple-600 text-white p-2 rounded-full disabled:opacity-50"
          >
            <FiSend className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;