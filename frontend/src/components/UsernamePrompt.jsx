import { useState } from 'react';

function UsernamePrompt({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="username-overlay">
      <div className="username-card">
        <h1>💬 ChatApp</h1>
        <p>Enter your name to start chatting</p>
        <form onSubmit={handleSubmit}>
          <input
            id="username-input"
            type="text"
            className="username-input"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={30}
          />
          <button id="username-submit" type="submit" className="username-btn" disabled={!name.trim()}>
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

export default UsernamePrompt;
