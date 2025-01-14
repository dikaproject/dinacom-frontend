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
  private lastMessageTime: number | null = null;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 3;
  private messageQueue: Array<any> = [];
  private isConnecting = false;
  private connectionPromise: Promise<boolean> | null = null;

  async connect() {
    if (this.socket?.connected) {
      return true;
    }

    if (this.isConnecting) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        if (this.connectionAttempts >= this.maxConnectionAttempts) {
          // Reset connection attempts instead of rejecting immediately
          this.connectionAttempts = 0;
          await new Promise(r => setTimeout(r, 1000)); // Add delay before retry
        }

        this.connectionAttempts++;
        
        this.socket = io(process.env.NEXT_PUBLIC_API_SOCKET || 'http://localhost:5000', {
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          transports: ['websocket', 'polling'], // Try websocket first
          forceNew: false // Changed to false to reuse existing connection
        });

        // Setup connection verification with timeout
        const connectionTimeout = setTimeout(() => {
          if (!this.socket?.connected) {
            this.socket?.disconnect();
            this.isConnecting = false;
            reject(new Error('Connection timeout'));
          }
        }, 10000);

        this.socket.on('connect', () => {
          clearTimeout(connectionTimeout);
          this.connectionAttempts = 0;
          this.isConnecting = false;
          this.setupSocketListeners();
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          reject(error);
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });

    return this.connectionPromise;
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

    this.socket.io.on("ping", () => {
      console.log("Socket ping");
    });

    this.socket.io.on("reconnect_attempt", (attempt) => {
      console.log("Reconnection attempt:", attempt);
    });

    // Add heartbeat to keep connection alive
    setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('heartbeat');
      }
    }, 25000);
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { event, data, resolve, reject } = this.messageQueue.shift()!;
      this.socket?.emit(event, data, (response: any) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      });
    }
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
        console.warn('Socket not connected, attempting reconnection...');
        this.messageQueue.push({
          event: 'send_message',
          data,
          resolve,
          reject
        });
        this.connect().catch(reject);
        return;
      }

      // Add connection check with timeout
      const connectionTimeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);

      this.socket?.emit('send_message', data, (response: any) => {
        clearTimeout(connectionTimeout);
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      });
    });
  }

  onReceiveMessage(callback: (message: ChatMessage) => void) {
    // Ensure we have an active connection before setting up listeners
    if (!this.socket?.connected) {
      this.connect().catch(console.error);
    }

    const messageHandler = (message: ChatMessage) => {
      if (this.socket?.connected) {
        callback(message);
      }
    };

    // Remove existing listener before adding new one
    this.socket?.off('receive_message');
    this.socket?.on('receive_message', messageHandler);
    this.addListener('receive_message', messageHandler);
  }

  onUserTyping(callback: (data: { username: string }) => void) {
    this.connect().catch(console.error);

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

  // Add method to verify connection status
  async verifyConnection(): Promise<boolean> {
    try {
      if (this.socket?.connected) {
        return true;
      }

      await this.connect();
      return this.socket?.connected || false;
    } catch (error) {
      console.error('Connection verification failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const chatServiceInstance = new ChatService();
export const chatService = chatServiceInstance;