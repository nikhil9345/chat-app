import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function ChatWindow({
  messages,
  userId,
  onDeleteForMe,
  onDeleteForEveryone,
  onTogglePin
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="chat-window">
        <div className="chat-empty">
          <span className="chat-empty-icon">💬</span>
          <p>No messages yet. Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isSent={msg.senderId === userId}
          userId={userId}
          onDeleteForMe={onDeleteForMe}
          onDeleteForEveryone={onDeleteForEveryone}
          onTogglePin={onTogglePin}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
