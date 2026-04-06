import { useState } from 'react';

function MessageBubble({
  message,
  isSent,
  userId,
  onDeleteForMe,
  onDeleteForEveryone,
  onTogglePin
}) {
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  // Guard: prevent crash if message is undefined
  if (!message) return null;

  const isDeleted = message.isDeletedForEveryone;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`message-row ${isSent ? 'sent' : 'received'}`}>

      {!isSent && (
        <span className="message-sender">{message.sender}</span>
      )}

      <div
        className={`message-bubble 
          ${message.isPinned ? 'pinned' : ''} 
          ${isDeleted ? 'deleted' : ''}`}
      >
        {message.isPinned && !isDeleted && (
          <span className="message-pin-badge">📌</span>
        )}
        {message.content}
      </div>

      <span className="message-time">
        {formatTime(message.timestamp)}
      </span>

      {!isDeleted && (
        <div className="message-actions" style={{ position: 'relative' }}>

          <button
            className="action-btn pin-btn"
            onClick={() => onTogglePin(message._id)}
          >
            📌 {message.isPinned ? 'Unpin' : 'Pin'}
          </button>

          <button
            className="action-btn delete-btn"
            onClick={() => setShowDeleteMenu(!showDeleteMenu)}
          >
            🗑️ Delete
          </button>

          {showDeleteMenu && (
            <div className="delete-menu">

              <button
                className="delete-menu-item"
                onClick={() => {
                  onDeleteForMe(message._id);
                  setShowDeleteMenu(false);
                }}
              >
                🙈 Delete for Me
              </button>

              {isSent && (
                <button
                  className="delete-menu-item"
                  onClick={() => {
                    onDeleteForEveryone(message._id);
                    setShowDeleteMenu(false);
                  }}
                >
                  🗑️ Delete for Everyone
                </button>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;