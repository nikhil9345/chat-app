import { useState, useEffect, useCallback } from 'react';
import socket from './socket';
import { getMessages, sendMessage, deleteForMe, deleteForEveryone, togglePin } from './services/api';
import UsernamePrompt from './components/UsernamePrompt';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import PinnedMessages from './components/PinnedMessages';

function App() {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user identity from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('chatUserId');
    const storedUsername = localStorage.getItem('chatUsername');
    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  // Fetch messages when user is identified
  useEffect(() => {
    if (!userId) return;
    const fetchMessages = async () => {
      try {
        const res = await getMessages(userId);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [userId]);

  // Socket.IO listeners
  useEffect(() => {
    if (!userId) return;

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        const updated = [...prev, message];
        return updated.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
      });
    });

    socket.on('messageDeleted', ({ messageId, type, userId: deletedUserId }) => {
      if (type === 'everyone') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, content: '🚫 This message was deleted', isDeletedForEveryone: true }
              : msg
          )
        );
      } else if (type === 'me' && deletedUserId === userId) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    });

    socket.on('messagePinned', ({ messageId, isPinned }) => {
      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg._id === messageId ? { ...msg, isPinned } : msg
        );
        return updated.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
      });
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageDeleted');
      socket.off('messagePinned');
    };
  }, [userId]);

  const handleUsernameSubmit = (name) => {
    let id = localStorage.getItem('chatUserId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('chatUserId', id);
    }
    localStorage.setItem('chatUsername', name);
    setUserId(id);
    setUsername(name);
  };

  const handleSend = useCallback(async (content) => {
    try {
      await sendMessage({ content, sender: username, senderId: userId });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [username, userId]);

  const handleDeleteForMe = useCallback(async (messageId) => {
    try {
      await deleteForMe(messageId, userId);

      setMessages(prev =>
        prev.filter(msg => msg._id !== messageId)
      );

    } catch (err) {
      console.error('Failed to delete for me:', err);
    }
  }, [userId, setMessages]);

  const handleDeleteForEveryone = useCallback(async (messageId) => {
    try {
      await deleteForEveryone(messageId);
    } catch (err) {
      console.error('Failed to delete for everyone:', err);
    }
  }, []);

  const handleTogglePin = useCallback(async (messageId) => {
    try {
      await togglePin(messageId);
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  }, []);

  if (loading) return null;

  if (!userId || !username) {
    return <UsernamePrompt onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="app-container">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-icon">💬</div>
          <div>
            <h1>ChatApp</h1>
            <span className="chat-header-subtitle">
              <span className="online-dot"></span>
              Global Room &middot; {username}
            </span>
          </div>
        </div>
      </div>

      <PinnedMessages messages={messages} />

      <ChatWindow
        messages={messages}
        userId={userId}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
        onTogglePin={handleTogglePin}
      />

      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default App;
