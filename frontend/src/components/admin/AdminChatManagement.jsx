import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Send,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Mic,
  Paperclip
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminChatManagement = () => {
  const { user } = useAuth();
  const { adminJoinChat, sendMessage, isConnected, socket } = useChat();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [filter, setFilter] = useState('active');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Listen for new messages and update selected chat
  useEffect(() => {
    if (socket && selectedChat) {
      const handleNewMessage = (message) => {
        console.log('Admin received new message:', message);
        if (message.chatId === selectedChat.chatId) {
          setSelectedChat(prev => ({
            ...prev,
            messages: [...(prev.messages || []), message]
          }));
        }
      };

      socket.on('newMessage', handleNewMessage);

      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    const loadChats = async () => {
      if (user?.role === 'admin') {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat/admin/all?status=${filter}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            setChats(data.chats || []);
          } else {
            toast.error('Failed to load chats');
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
          toast.error('Error loading chats');
        } finally {
          setLoading(false);
        }
      }
    };

    loadChats();
  }, [user, filter]);

  // Load chat details when selected
  const handleChatSelect = async (chat) => {
    try {
      setChatLoading(true);
      setSelectedChat(null); // Clear previous chat
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat/history/${chat.chatId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.chat) {
          setSelectedChat(data.chat);
          adminJoinChat(chat.chatId);
          toast.success('Chat loaded successfully');
        } else {
          toast.error('Failed to load chat data');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to load chat details');
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      toast.error('Error loading chat details');
    } finally {
      setChatLoading(false);
    }
  };

  // Send message as admin
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !selectedChat) return;

    const success = sendMessage(selectedChat.chatId, currentMessage);
    if (success) {
      setCurrentMessage('');
    }
  };

  // Update chat status
  const updateChatStatus = async (chatId, status) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat/admin/status/${chatId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        toast.success(`Chat marked as ${status}`);
        // Refresh chat list
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat/admin/all?status=${filter}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setChats(refreshData.chats || []);
        }
        
        if (selectedChat && selectedChat.chatId === chatId) {
          setSelectedChat(prev => ({ ...prev, status }));
        }
      } else {
        toast.error('Failed to update chat status');
      }
    } catch (error) {
      console.error('Error updating chat status:', error);
      toast.error('Error updating status');
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center p-6">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to access chat management.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="mr-3 text-orange-500" />
          Chat Management
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No chats found
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.chatId}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.chatId === chat.chatId 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      {chat.participants.find(p => p.role !== 'admin')?.name || 'Unknown User'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(chat.status)}`}>
                      {chat.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">
                    {chat.lastMessage?.message?.substring(0, 50)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <MessageCircle size={12} className="mr-1" />
                      {chat.messageCount} messages
                    </span>
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatTime(chat.lastActivity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Details */}
        <div className="lg:col-span-2">
          {chatLoading ? (
            <div className="border border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading chat...</p>
              </div>
            </div>
          ) : selectedChat ? (
            <div className="border border-gray-200 rounded-lg h-96 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Chat ID: {selectedChat.chatId}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <User size={14} className="mr-1" />
                        {selectedChat.participants?.find(p => p.role !== 'admin')?.name || 'Unknown User'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedChat.status)}`}>
                        {selectedChat.status}
                      </span>
                      {selectedChat.participants && (
                        <span className="text-xs text-gray-500">
                          {selectedChat.participants.length} participant{selectedChat.participants.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateChatStatus(selectedChat.chatId, 'resolved')}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Resolve
                    </button>
                    <button
                      onClick={() => updateChatStatus(selectedChat.chatId, 'closed')}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 flex items-center"
                    >
                      <XCircle size={14} className="mr-1" />
                      Close
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedChat.messages && selectedChat.messages.length > 0 ? (
                  selectedChat.messages.map((message, index) => {
                    const isAdmin = message.senderRole === 'admin' || message.senderId === user.id;
                    const isSystem = message.messageType === 'system' || message.senderRole === 'system';
                    
                    if (isSystem) {
                      return (
                        <div key={index} className="flex justify-center">
                          <div className="bg-white border text-gray-600 text-center text-sm px-4 py-2 rounded-lg max-w-md shadow-sm">
                            <div>{message.message}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`${isAdmin ? 'ml-8 max-w-sm' : 'mr-8 max-w-md'}`}>
                          <div
                            className={`p-3 rounded-lg shadow-sm ${
                              isAdmin
                                ? 'bg-orange-500 text-white rounded-br-sm border border-orange-600'
                                : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                            }`}
                          >
                            {!isAdmin && (
                              <div className="text-xs font-semibold mb-2 text-orange-600 border-b border-orange-100 pb-1">
                                {message.senderName}
                                {message.senderRole && message.senderRole !== 'user' && (
                                  <span className="ml-1 text-gray-500 font-normal">({message.senderRole})</span>
                                )}
                              </div>
                            )}
                            
                            {/* Media Content */}
                            {message.messageType === 'media' && message.mediaUrl && (
                              <div className="mb-2">
                                {message.mediaType === 'voice' && (
                                  <div className="flex items-center space-x-2 bg-black/10 rounded-lg p-2">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                      <Mic size={12} className="text-white" />
                                    </div>
                                    <audio controls className="flex-1 h-8"
                                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${message.mediaUrl}`}
                                    >
                                      Your browser does not support audio playback.
                                    </audio>
                                  </div>
                                )}
                                
                                {(message.mediaType === 'image' || message.mediaType === 'camera') && (
                                  <div className="rounded-lg overflow-hidden max-w-xs">
                                    <img 
                                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${message.mediaUrl}`}
                                      alt={message.fileName}
                                      className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${message.mediaUrl}`, '_blank')}
                                    />
                                  </div>
                                )}
                                
                                {message.mediaType !== 'voice' && message.mediaType !== 'image' && message.mediaType !== 'camera' && (
                                  <div className="flex items-center space-x-2 bg-black/10 rounded-lg p-2">
                                    <Paperclip size={16} />
                                    <a 
                                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${message.mediaUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:text-blue-600 text-sm underline"
                                    >
                                      {message.fileName}
                                    </a>
                                    {message.fileSize && (
                                      <span className="text-xs opacity-60">
                                        ({(message.fileSize / 1024 / 1024).toFixed(2)}MB)
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Text Message */}
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</div>
                            <div className={`text-xs mt-2 ${
                              isAdmin ? 'text-orange-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                              {isAdmin && <span className="ml-1 font-medium">(You)</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No messages in this conversation yet.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={!isConnected || selectedChat.status === 'closed'}
                  />
                  <button
                    type="submit"
                    disabled={!currentMessage.trim() || !isConnected || selectedChat.status === 'closed'}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Send size={16} className="mr-1" />
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Select a chat to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatManagement;
