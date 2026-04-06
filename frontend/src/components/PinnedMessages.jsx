function PinnedMessages({ messages }) {
  const pinnedMessages = messages.filter(
    (msg) => msg.isPinned && !msg.isDeletedForEveryone
  );

  if (pinnedMessages.length === 0) return null;

  return (
    <div className="pinned-bar">
      <span className="pinned-bar-label">📌 Pinned</span>

      {pinnedMessages.map((msg) => (
        <span key={msg._id} className="pinned-chip" title={msg.content}>
          <strong>{msg.sender}:</strong>&nbsp;{msg.content}
        </span>
      ))}
    </div>
  );
}

export default PinnedMessages;