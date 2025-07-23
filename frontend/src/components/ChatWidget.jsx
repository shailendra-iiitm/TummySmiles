import { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Send, 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2,
  Users,
  Clock,
  AlertCircle,
  Paperclip,
  Image,
  Mic,
  MicOff,
  Phone,
  Video,
  Smile,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const ChatWidget = () => {
  const { user } = useAuth();
  const { 
    isConnected, 
    activeChat, 
    setActiveChat, 
    messages, 
    sendMessage, 
    sendTypingIndicator,
    typingUsers 
  } = useChat();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null); // 'voice' or 'video'
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Start or get existing chat
  const startChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveChat(data.chat);
        setIsOpen(true);
        setIsMinimized(false);
      } else {
        toast.error('Failed to start chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to connect to chat');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle message sending
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !activeChat) return;

    const success = sendMessage(activeChat.chatId, currentMessage);
    if (success) {
      setCurrentMessage('');
      // Stop typing indicator
      handleStopTyping();
    }
  };

  // Handle typing indicators
  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    
    if (!isTyping && activeChat) {
      setIsTyping(true);
      sendTypingIndicator(activeChat.chatId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping && activeChat) {
      setIsTyping(false);
      sendTypingIndicator(activeChat.chatId, false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Handle file attachment
  const handleFileAttachment = async (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'image') {
      input.accept = 'image/*';
    } else if (type === 'camera') {
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera
    } else if (type === 'file') {
      input.accept = '*/*';
    }
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await sendMediaFile(file, type);
        setShowAttachments(false);
      }
    };
    
    input.click();
  };

  // Send media file
  const sendMediaFile = async (file, type) => {
    if (!activeChat) return;

    try {
      toast.loading(`Uploading ${file.name}...`);
      const formData = new FormData();
      // Use correct field name for audio
      if (type === 'voice') {
        formData.append('audio', file);
      } else {
        formData.append('media', file);
      }
      formData.append('chatId', activeChat.chatId);
      formData.append('messageType', type);
      formData.append('fileName', file.name);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/send-media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      toast.dismiss();
      if (response.ok) {
        toast.success(`${file.name} sent successfully!`);
      } else {
        const fileIcon = type === 'image' ? '🖼️' : '📎';
        const success = sendMessage(activeChat.chatId, `${fileIcon} ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        if (success) {
          toast.success('File info sent (upload service needed)');
        } else {
          toast.error('Failed to send file');
        }
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error sending file:', error);
      const fileIcon = type === 'image' ? '🖼️' : '📎';
      const success = sendMessage(activeChat.chatId, `${fileIcon} ${file.name} - File selected but upload service needed`);
      if (success) {
        toast.success('File notification sent');
      } else {
        toast.error('Failed to send file');
      }
    }
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      recorder.start();

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      recorder.onstop = async () => {
        clearInterval(timer);
        setIsRecording(false);
        
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        
        // Send voice message
        await sendVoiceMessage(audioBlob);
        
        // Reset states
        setAudioChunks([]);
        setRecordingTime(0);
        setMediaRecorder(null);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

    } catch (error) {
      console.error('Microphone access error:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  // Send voice message
  const sendVoiceMessage = async (audioBlob) => {
    if (!activeChat) return;

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.wav');
      formData.append('chatId', activeChat.chatId);
      formData.append('messageType', 'voice');

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/send-media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Voice message sent!');
      } else {
        // Fallback: send as text message indicating voice message
        const success = sendMessage(activeChat.chatId, '🎤 Voice message (audio file processing...)');
        if (success) {
          toast.success('Voice message notification sent');
        } else {
          toast.error('Failed to send voice message');
        }
      }
    } catch (error) {
      console.error('Error sending voice message:', error);
      // Fallback: send as text message
      const success = sendMessage(activeChat.chatId, '🎤 Voice message recorded');
      if (success) {
        toast.success('Voice message notification sent');
      } else {
        toast.error('Failed to send voice message');
      }
    }
  };

  // Handle calls
  const startCall = (type) => {
    setCallType(type);
    setInCall(true);
    toast.success(`Starting ${type} call (WebRTC integration needed)`);
  };

  const endCall = () => {
    setInCall(false);
    setCallType(null);
    toast.success('Call ended');
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={startChat}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <MessageCircle size={24} />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl border-0 transition-all duration-300 backdrop-blur-sm ${
          isMinimized ? 'w-96 h-16' : 'w-96 h-[520px]'
        }`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-2xl flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Support Chat</h3>
                <div className="flex items-center space-x-2 text-xs opacity-90">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`}></div>
                  <span>{isConnected ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Call Buttons */}
              <button
                onClick={() => startCall('voice')}
                className="hover:bg-white/20 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                title="Voice Call"
              >
                <Phone size={14} />
              </button>
              <button
                onClick={() => startCall('video')}
                className="hover:bg-white/20 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                title="Video Call"
              >
                <Video size={14} />
              </button>
              
              {/* Minimize/Maximize */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                {messages.map((message, index) => {
                  const isOwn = String(message.senderId) === String(user?.id);
                  const isSystem = message.messageType === 'system';
                  
                  return (
                    <div
                      key={index}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isSystem ? 'justify-center' : ''}`}
                    >
                      <div
                        className={`p-4 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                          isSystem 
                            ? 'max-w-xs bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700' 
                            : isOwn 
                              ? 'max-w-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md' 
                              : 'max-w-md bg-white border border-gray-100 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        {message.messageType !== 'system' && !isOwn && (
                          <div className="text-xs font-bold mb-2 text-orange-500 opacity-80">
                            {message.senderName}
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
                                <audio controls className="flex-1 h-8">
                                  <source src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${message.mediaUrl}`} type="audio/wav" />
                                  Your browser does not support audio playback.
                                </audio>
                              </div>
                            )}
                            
                            {(message.mediaType === 'image' || message.mediaType === 'camera') && (
                              <div className="rounded-lg overflow-hidden">
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
                        <div className="text-sm leading-relaxed">{message.message}</div>
                        <div className={`text-xs mt-2 ${
                          message.messageType === 'system' ? 'text-blue-500' :
                          isOwn ? 'text-orange-100' : 'text-gray-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {Array.from(typingUsers)[0]} is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
                
                {/* Attachment Options */}
                {showAttachments && (
                  <div className="mb-3 flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => handleFileAttachment('image')}
                      className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-2 rounded-full text-xs transition-colors"
                    >
                      <Image size={14} />
                      <span>Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileAttachment('file')}
                      className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-600 px-3 py-2 rounded-full text-xs transition-colors"
                    >
                      <Paperclip size={14} />
                      <span>File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileAttachment('camera')}
                      className="flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-600 px-3 py-2 rounded-full text-xs transition-colors"
                    >
                      <Camera size={14} />
                      <span>Camera</span>
                    </button>
                  </div>
                )}

                {/* Recording Interface */}
                {isRecording && (
                  <div className="mb-3 flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-600">Recording...</span>
                      <span className="text-sm font-mono text-red-600">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      <MicOff size={14} />
                    </button>
                  </div>
                )}

                {/* Main Input Area */}
                <div className="flex items-center space-x-2">
                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => setShowAttachments(!showAttachments)}
                    className={`p-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                      showAttachments 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Paperclip size={16} />
                  </button>

                  {/* Text Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentMessage}
                    onChange={handleTyping}
                    onBlur={handleStopTyping}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 border-0 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
                    disabled={!isConnected}
                  />

                  {/* Voice Message Button */}
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    disabled={!isConnected}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!currentMessage.trim() || !isConnected}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </div>
                
                {!isConnected && (
                  <div className="flex items-center justify-center space-x-2 mt-3 text-xs text-red-500 bg-red-50 rounded-full px-3 py-2">
                    <AlertCircle size={12} />
                    <span>Reconnecting to chat...</span>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {/* Call Interface Overlay */}
      {inCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-60 flex items-center justify-center">
          <div className="bg-gradient-to-b from-gray-900 to-black text-white rounded-3xl p-8 w-80 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                {callType === 'video' ? <Video size={32} /> : <Phone size={32} />}
              </div>
              <h3 className="text-xl font-bold mb-2">Support Agent</h3>
              <p className="text-gray-300 text-sm">
                {callType === 'video' ? 'Video Call' : 'Voice Call'} in progress...
              </p>
            </div>

            {callType === 'video' && (
              <div className="mb-6">
                <div className="bg-gray-800 rounded-2xl h-40 flex items-center justify-center mb-4">
                  <span className="text-gray-400">Video Preview</span>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => toast.success('Mute toggled (feature to be implemented)')}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full transition-colors"
              >
                <MicOff size={20} />
              </button>
              
              {callType === 'video' && (
                <button
                  onClick={() => toast.success('Camera toggled (feature to be implemented)')}
                  className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full transition-colors"
                >
                  <Video size={20} />
                </button>
              )}
              
              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 p-3 rounded-full transition-colors"
              >
                <Phone size={20} className="rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
