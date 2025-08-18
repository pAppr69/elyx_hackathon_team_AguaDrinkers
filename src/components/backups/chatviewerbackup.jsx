export default function ChatViewer({ chats, filterIds, title }) {
    const filtered = Array.isArray(filterIds)
      ? chats.filter((m) => filterIds.includes(m.id))
      : chats.slice(-40); // recent fallback
  
    return (
      <div className="chat-panel">
        <div className="chat-header">{title}</div>
        <div className="chat-list">
          {filtered.map((m) => (
            <Bubble key={m.id} msg={m} />
          ))}
        </div>
      </div>
    );
  }
  
  function Bubble({ msg }) {
    const isMember = (msg.role || "").toLowerCase() === "member";
    return (
      <div className={`bubble-row ${isMember ? "right" : "left"}`}>
        <div className="bubble">
          <div className="meta">
            <strong>{msg.sender || (isMember ? "Member" : msg.role || "Elyx")}</strong>
            <span> · {formatDateTime(msg.timestamp)}</span>
          </div>
          <div className="text">{msg.message || msg.text}</div>
        </div>
      </div>
    );
  }
  
  function formatDateTime(s) {
    const d = new Date(s);
    return d.toLocaleString(undefined, {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }