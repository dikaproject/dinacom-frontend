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
    const initializeChat = async () => {
      try {
        if (!id) {
          toast.error('Invalid consultation ID');
          router.push('/dashboard/consultation');
          return;
        }

        setLoading(true);
        const response = await consultationService.startConsultation(id as string);
        
        if (!response.chatEnabled) {
          toast.error('Chat is not available for this consultation');
          router.push('/dashboard/consultation');
          return;
        }

        setConsultation(response.consultation as unknown as ConsultationData);
        setMessages(prevMessages => {
          // Merge existing messages with new ones, avoiding duplicates
          const newMessages = [...prevMessages];
          response.messages?.forEach(message => {
            if (!newMessages.some(m => m.id === message.id)) {
              newMessages.push(message);
            }
          });
          return newMessages.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        // Setup chat service
        chatService.connect();
        chatService.joinConsultation(id as string);
        
        // Update message listener to handle real-time updates
        chatService.onReceiveMessage((message: ChatMessage) => {
          setMessages(prevMessages => {
            // Check if message already exists
            if (prevMessages.some(m => m.id === message.id)) {
              return prevMessages;
            }
            // Add new message and sort by timestamp
            const newMessages = [...prevMessages, message].sort((a, b) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            return newMessages;
          });
          
          // Ensure scroll to bottom happens after state update
          requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          });
        });

        chatService.onUserTyping(({ username }) => {
          if (username !== consultation?.user?.profile?.fullName) {
            setPeerTyping(true);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setPeerTyping(false);
            }, 3000);
          }
        });

      } catch (err) {
        console.error('Chat initialization error:', err);
        toast.error('Failed to join consultation');
        router.push('/dashboard/consultation');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      initializeChat();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (debouncedTyping.current) {
        clearTimeout(debouncedTyping.current);
      }
      chatService.disconnect();
    };
  }, [id, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add connection status check
  useEffect(() => {
    const checkConnection = setInterval(() => {
      const connected = chatService.isConnected();
      setIsConnected(connected);
      
      if (!connected) {
        console.log('Attempting to reconnect...');
        chatService.reconnect();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkConnection);
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