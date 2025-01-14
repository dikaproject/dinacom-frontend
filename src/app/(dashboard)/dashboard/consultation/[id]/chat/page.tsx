"use client"

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { chatService } from '@/services/chat';
import { consultationService } from '@/services/consultation';

interface ChatMessage {
  id?: string;
  content: string;
  senderId: string;
  createdAt: string; // Changed from Date to string
}

interface ConsultationDoctor {
  fullName: string;
}

interface ConsultationUser {
  profile?: {
    fullName: string;
  };
}

interface ConsultationData {
  id: string;
  userId: string;
  doctor: ConsultationDoctor;
  user: ConsultationUser;
  schedule: Date;
  type: 'ONLINE' | 'OFFLINE';
}

const ChatRoom = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Initialize with empty array
  const [newMessage, setNewMessage] = useState('');
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [peerTyping, setPeerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedTyping = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Memoize the date format to prevent re-renders
  const formattedDate = useMemo(() => {
    if (!consultation?.schedule) return '';
    try {
      return format(new Date(consultation.schedule), 'PPP p');
    } catch (error) {
      console.error('Invalid date:', error);
      return 'Invalid date';
    }
  }, [consultation?.schedule]);

  useEffect(() => {
    let mounted = true;
    let connectionRetryCount = 0;
    const maxRetries = 3;
    
    const initializeChat = async () => {
      try {
        setLoading(true);
        
        // First establish socket connection
        const connectSocket = async () => {
          while (connectionRetryCount < maxRetries) {
            try {
              await chatService.connect();
              break;
            } catch (error) {
              connectionRetryCount++;
              if (connectionRetryCount === maxRetries) {
                throw new Error('Failed to connect to chat server');
              }
              await new Promise(r => setTimeout(r, 2000)); // Wait before retry
            }
          }
        };

        await connectSocket();

        const { consultation, messages } = await consultationService.startConsultation(id as string);
        
        if (!mounted) return;

        if (consultation) {
          setConsultation(consultation as ConsultationData);
          
          // Join consultation room after successful connection
          chatService.joinConsultation(id as string);

          // Setup message listener
          chatService.onReceiveMessage((message: ChatMessage) => {
            setMessages(prev => {
              if (prev.some(m => m.id === message.id)) return prev;
              return [...prev, message].sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            });
            
            requestAnimationFrame(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
          });

          // Setup typing indicator with error handling
          try {
            chatService.onUserTyping(({ username }) => {
              if (username !== consultation?.doctor?.fullName) {
                setPeerTyping(true);
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                  setPeerTyping(false);
                }, 3000);
              }
            });
          } catch (error) {
            console.error('Error setting up typing indicator:', error);
          }

          if (messages) {
            setMessages(messages);
          }
        }

      } catch (error) {
        console.error('Chat initialization error:', error);
        toast.error('Failed to connect to chat. Please refresh the page.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeChat();

    // Cleanup function
    return () => {
      mounted = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      chatService.disconnect();
    };
  }, [id, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add reconnection handler
  useEffect(() => {
    const reconnectInterval = setInterval(() => {
      if (!chatService.isConnected()) {
        chatService.reconnect();
      }
    }, 5000);

    return () => clearInterval(reconnectInterval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !consultation?.userId) return;

    try {
      await chatService.sendMessage({
        consultationId: id as string,
        content: newMessage,
        senderId: consultation.userId
      });
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Clear any existing debounce timer
    if (debouncedTyping.current) {
      clearTimeout(debouncedTyping.current);
    }

    // Set new debounce timer
    debouncedTyping.current = setTimeout(() => {
      if (value.trim() && consultation?.userId) {
        chatService.emitTyping(
          id as string,
          consultation?.user?.profile?.fullName || 'Patient'
        );
      }
    }, 500);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
          Reconnecting to chat server...
        </div>
      )}
      
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4">
        <div>
          <h1 className="text-xl text-gray-700 font-semibold">
            Dr. {consultation?.doctor?.fullName}
          </h1>
          <p className="text-sm text-gray-500">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.senderId === consultation?.userId ? 'justify-end' : 'justify-start text-gray-700'
            }`}
          >
            <div className={`max-w-[70%] ${
              message.senderId === consultation?.userId
                ? 'bg-purple-600 text-white'
                : 'bg-white'
            } rounded-lg px-4 py-2 shadow-sm`}>
              <p className="break-words">{message.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${
                  message.senderId === consultation?.userId
                    ? 'text-purple-200'
                    : 'text-gray-400'
                }`}>
                  {format(new Date(message.createdAt), 'p')}
                </span>
                <span className={`text-xs ml-2 ${
                  message.senderId === consultation?.userId
                    ? 'text-purple-200'
                    : 'text-gray-700'
                }`}>
                  {message.senderId === consultation?.userId 
                    ? 'You' 
                    : `Dr. ${consultation?.doctor?.fullName}`}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        {peerTyping && (
          <div className="text-sm text-gray-500 italic">
            Dr. {consultation?.doctor?.fullName} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;