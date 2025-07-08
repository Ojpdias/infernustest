import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'roll' | 'action';
}

interface PublicChatProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
  className?: string;
}

const PublicChat: React.FC<PublicChatProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  className = '',
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para a mensagem mais recente
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageColor = (senderId: string, type: string) => {
    if (senderId === currentUserId) {
      return 'text-infernus-gold';
    }
    
    switch (type) {
      case 'roll':
        return 'text-blue-400';
      case 'action':
        return 'text-orange-400';
      default:
        return 'text-infernus-silver';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'roll':
        return '🎲';
      case 'action':
        return '⚡';
      default:
        return '💬';
    }
  };

  return (
    <div className={`infernal-panel ${className}`}>
      <h3 className="gothic-title text-lg mb-3">Chat</h3>
      
      {/* Área de mensagens */}
      <div ref={messagesRef} className="combat-log mb-3">
        {messages.length === 0 ? (
          <div className="text-center text-infernus-silver py-4">
            No messages yet
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="flex items-start space-x-2 mb-2 p-2 rounded hover:bg-infernus-charcoal/30 transition-colors"
            >
              <span className="text-sm mt-0.5">
                {getMessageIcon(message.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-infernus-gold">
                    {message.senderName}
                  </span>
                  <span className="text-xs text-infernus-silver/70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className={`text-sm ${getMessageColor(message.senderId, message.type)}`}>
                  {message.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input de mensagem */}
      <div className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-infernus-black border border-infernus-gold rounded text-infernus-gold placeholder-infernus-silver/50 focus:outline-none focus:ring-2 focus:ring-infernus-gold"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          size="sm"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

// Função utilitária para criar mensagens de chat
export const createChatMessage = (
  senderId: string,
  senderName: string,
  message: string,
  type: ChatMessage['type'] = 'message'
): ChatMessage => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  senderId,
  senderName,
  message,
  timestamp: new Date(),
  type,
});

export default PublicChat;

