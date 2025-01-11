/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/chat';

class ChatService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_API_SOCKET || 'http://localhost:5000', {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 10000,
      transports: ['websocket', 'polling']
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat server with ID:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try reconnecting
        this.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected on attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    this.socket.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });
  }

  joinConsultation(consultationId: string, isCompleted: boolean = false) {
    if (!this.socket?.connected) {
      this.connect();
    }
    
    // For completed consultations, we only join the room to view history
    this.socket?.emit('join_consultation', consultationId);
  }

  leaveConsultation(consultationId: string) {
    this.socket?.emit('leave_consultation', consultationId);
  }

  sendMessage(data: {
    consultationId: string;
    content: string;
    senderId: string;
    isCompleted?: boolean;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        this.connect();
      }

      // Prevent sending messages if consultation is completed
      if (data.isCompleted) {
        reject(new Error('Cannot send messages in completed consultation'));
        return;
      }

      console.log('Sending message:', data);

      this.socket?.emit('send_message', data, (response: any) => {
        console.log('Message send response:', response);
        if (response.error) {
          reject(response.error);
        } else {
          resolve();
        }
      });
    });
  }

  onReceiveMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket?.connected) {
      this.connect();
    }

    const messageHandler = (message: ChatMessage) => {
      console.log('Received message:', message);
      if (this.socket?.connected) {
        callback(message);
      } else {
        console.warn('Socket disconnected, attempting reconnect...');
        this.connect();
      }
    };

    this.socket?.off('receive_message'); // Remove existing listeners
    this.socket?.on('receive_message', messageHandler);
    this.addListener('receive_message', messageHandler);
  }

  onUserTyping(callback: (data: { username: string }) => void) {
    if (!this.socket?.connected) {
      this.connect();
    }

    // Remove existing listener first
    this.socket?.off('user_typing');
    this.socket?.on('user_typing', (data) => {
      console.log('User typing:', data);
      callback(data);
    });
  }

  emitTyping(consultationId: string, username: string) {
    if (!this.socket?.connected) {
      this.connect();
    }
    console.log('Emitting typing:', { consultationId, username });
    this.socket?.emit('typing', { consultationId, username });
  }

  private addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  private removeListener(event: string) {
    if (this.socket && this.listeners.has(event)) {
      this.listeners.get(event)?.forEach(callback => {
        this.socket?.off(event, callback as any);
      });
      this.listeners.delete(event);
    }
  }

  disconnect() {
    Array.from(this.listeners.keys()).forEach(event => {
      this.removeListener(event);
    });
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  reconnect() {
    if (!this.isConnected()) {
      this.connect();
    }
  }
}

// Create singleton instance
const chatServiceInstance = new ChatService();
export const chatService = chatServiceInstance;