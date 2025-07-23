import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [unreadChats, setUnreadChats] = useState(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (token && user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
        toast.success('Chat connected', { icon: '💬' });
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
        toast.error('Chat disconnected', { icon: '💬' });
      });

      newSocket.on('connect_error', (error) => {
        console.error('Chat connection error:', error);
        setIsConnected(false);
        toast.error('Failed to connect to chat');
      });

      // Listen for new messages
      newSocket.on('newMessage', (message) => {
        console.log('Received new message:', message);
        console.log('Current user ID:', user.id);
        console.log('Message sender ID:', message.senderId);
        
        setMessages(prev => [...prev, message]);
        
        // Show notification if message is not from current user
        if (String(message.senderId) !== String(user.id)) {
          toast.success(`New message from ${message.senderName}`, {
            icon: '💬',
            duration: 3000
          });
          
          // Update unread count
          if (message.chatId !== activeChat?.chatId) {
            setUnreadChats(prev => {
              const newMap = new Map(prev);
              const currentCount = newMap.get(message.chatId) || 0;
              newMap.set(message.chatId, currentCount + 1);
              return newMap;
            });
          }
        }
      });

      // Listen for user online status
      newSocket.on('userOnlineStatus', (data) => {
        setOnlineUsers(prev => {
          const newMap = new Map(prev);
          if (data.status === 'online') {
            newMap.set(data.userId, {
              userName: data.userName,
              lastSeen: new Date()
            });
          } else {
            newMap.delete(data.userId);
          }
          return newMap;
        });
      });

      // Listen for typing indicators
      newSocket.on('userTyping', (data) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userName);
          } else {
            newSet.delete(data.userName);
          }
          return newSet;
        });
      });

      // Listen for admin joining chat
      newSocket.on('adminJoinedChat', (data) => {
        toast.success(data.message, { icon: '👨‍💼' });
        setMessages(prev => [...prev, {
          senderId: 'system',
          senderName: 'System',
          senderRole: 'system',
          message: data.message,
          timestamp: new Date(),
          messageType: 'system'
        }]);
      });

      // Listen for user joining/leaving chat
      newSocket.on('userJoinedChat', (data) => {
        setMessages(prev => [...prev, {
          senderId: 'system',
          senderName: 'System',
          senderRole: 'system',
          message: `${data.userName} joined the chat`,
          timestamp: new Date(),
          messageType: 'system'
        }]);
      });

      newSocket.on('userLeftChat', (data) => {
        setMessages(prev => [...prev, {
          senderId: 'system',
          senderName: 'System',
          senderRole: 'system',
          message: `${data.userName} left the chat`,
          timestamp: new Date(),
          messageType: 'system'
        }]);
      });

      // Admin notifications (for admin users)
      if (user.role === 'admin') {
        newSocket.on('adminNotification', (data) => {
          if (data.type === 'newChatMessage') {
            toast.success(`New message from ${data.senderName}`, {
              icon: '🔔',
              duration: 5000
            });
          }
        });
      }

      newSocket.on('error', (error) => {
        toast.error(error.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [token, user, activeChat?.chatId]); // Added missing dependency

  // Join chat room
  const joinChat = (chatId) => {
    if (socket && chatId) {
      socket.emit('joinChat', chatId);
      // Clear unread count for this chat
      setUnreadChats(prev => {
        const newMap = new Map(prev);
        newMap.delete(chatId);
        return newMap;
      });
    }
  };

  // Admin join chat
  const adminJoinChat = (chatId) => {
    if (socket && chatId && ['admin', 'agent'].includes(user?.role)) {
      socket.emit('adminJoinChat', chatId);
    }
  };

  // Send message
  const sendMessage = (chatId, message) => {
    if (socket && chatId && message.trim()) {
      socket.emit('sendMessage', { chatId, message: message.trim() });
      return true;
    }
    return false;
  };

  // Send typing indicator
  const sendTypingIndicator = (chatId, isTyping) => {
    if (socket && chatId) {
      socket.emit('typing', { chatId, isTyping });
    }
  };

  // Set active chat and load messages
  const setActiveChatWithMessages = (chat) => {
    setActiveChat(chat);
    if (chat) {
      setMessages(chat.messages || []);
      joinChat(chat.chatId);
    } else {
      setMessages([]);
    }
  };

  const value = {
    socket,
    isConnected,
    activeChat,
    setActiveChat: setActiveChatWithMessages,
    messages,
    setMessages,
    onlineUsers,
    typingUsers,
    unreadChats,
    joinChat,
    adminJoinChat,
    sendMessage,
    sendTypingIndicator
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
