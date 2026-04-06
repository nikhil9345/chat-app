import { useState } from 'react';

function MessageInput({ onSend }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
    }
  };

  return (
    <div className="message-input-area">
      <form onSubmit={handleSubmit} className="message-input-wrapper">
        <input
          id="message-input"
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />
        <button id="send-button" type="submit" className="send-btn" disabled={!content.trim()} aria-label="Send message">
          ➤
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
