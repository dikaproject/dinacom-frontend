"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiPaperclip, FiVideo, FiPhoneOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { chatService } from '@/services/chat';
import { consultationService, ConsultationStatus } from '@/services/consultation';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import type { ChatMessage } from '@/types/chat';
import { ConsultationHistory } from '@/types/consultation';

interface Doctor {
  id: string;
  userId: string;
  fullName: string;
}

interface ConsultationData extends Omit<ConsultationHistory, 'schedule' | 'doctor'> {
  schedule: Date;
  doctor: Doctor;
}

const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [peerTyping, setPeerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const debouncedTyping = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);

        // Initialize socket connection with retries
        let connectionAttempts = 0;
        const maxAttempts = 3;
        
        while (connectionAttempts < maxAttempts) {
          try {
            await chatService.connect();
            break;
          } catch (error) {
            connectionAttempts++;
            if (connectionAttempts === maxAttempts) {
              throw new Error('Failed to establish connection after multiple attempts');
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        const { consultation, messages } = await consultationService.startConsultation(id as string);
        
        if (!consultation || !consultation.doctor) {
          throw new Error('Invalid consultation data');
        }

        const consultationData: ConsultationData = {
          ...consultation,
          schedule: new Date(consultation.schedule),
          doctor: {
            id: consultation.doctor.id,
            userId: consultation.doctor.userId,
            fullName: consultation.doctor.fullName
          }
        };
        
        setConsultation(consultationData);
        setMessages(messages);

        // Join consultation room
        chatService.joinConsultation(id as string);
        
        // Setup message listener
        chatService.onReceiveMessage((message: ChatMessage) => {
          setMessages(prev => {
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
          
          requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          });
        });

        // Setup typing indicator
        chatService.onUserTyping(({ username }) => {
          if (username !== consultationData?.user?.profile?.fullName) {
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
        console.error('Chat initialization error:', error);
        toast.error('Connection failed. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
    
    // Add connection status check
    const connectionCheck = setInterval(() => {
      if (!chatService.isConnected()) {
        chatService.reconnect();
      }
    }, 5000);

    return () => {
      clearInterval(connectionCheck);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (debouncedTyping.current) {
        clearTimeout(debouncedTyping.current);
      }
      chatService.leaveConsultation(id as string);
      chatService.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !consultation?.doctor) return;
  
    try {
      await chatService.sendMessage({
        consultationId: id as string,
        content: newMessage,
        senderId: consultation.doctor.userId
      });
      setNewMessage('');
    } catch (error) {
      console.error('Send error:', error);
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
      if (value.trim() && consultation?.doctor?.userId) {
        chatService.emitTyping(
          id as string,
          consultation?.doctor?.fullName || 'Doctor'
        );
      }
    }, 500);
  };

  const handleEndConsultation = async () => {
    if (!window.confirm('Are you sure you want to end this consultation?')) return;

    try {
      await consultationService.updateConsultationStatus(
        id as string,
        ConsultationStatus.COMPLETED
      );
      toast.success('Consultation ended successfully');
    } catch {
      toast.error('Failed to end consultation');
    }
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
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl text-gray-700 font-semibold">
            Chat with {consultation?.user?.profile?.fullName}
          </h1>
          <p className="text-sm text-gray-500">
            {consultation?.schedule ? format(consultation.schedule, 'PPP p') : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {consultation?.type === 'ONLINE' && (
            <button
              onClick={() => {/* Implement video call */}}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FiVideo size={20} />
            </button>
          )}
          <button
            onClick={handleEndConsultation}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <FiPhoneOff />
            End Consultation
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.map((message, index) => (
          <motion.div
            key={message.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              // Perbaikan disini - menggunakan doctorId sebagai pembanding
              message.senderId === consultation?.doctor?.userId ? 'justify-end' : 'justify-start text-gray-700'
            }`}
          >
            <div className={`max-w-[70%] ${
              message.senderId === consultation?.doctor?.userId
                ? 'bg-purple-600 text-white'
                : 'bg-white'
            } rounded-lg px-4 py-2 shadow-sm`}>
              <p className="break-words">{message.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${
                  message.senderId === consultation?.doctor?.userId
                    ? 'text-white'
                    : 'text-gray-700'
                }`}>
                  {format(new Date(message.createdAt), 'p')}
                </span>
                <span className="text-xs ml-2">
                  {message.senderId === consultation?.doctor?.userId 
                    ? 'You'
                    : consultation?.user?.profile?.fullName}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        {peerTyping && (
          <div className="text-sm text-gray-500 italic">
            {consultation?.user?.profile?.fullName} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <FiPaperclip size={20} />
          </button>
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