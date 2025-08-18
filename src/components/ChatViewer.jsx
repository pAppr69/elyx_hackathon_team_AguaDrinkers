import React from "react";

export default function ChatViewer({ chats, filterIds, title }) {
  const filtered = Array.isArray(filterIds)
    ? chats.filter((m) => filterIds.includes(m.id || m.messageId))
    : chats.slice(-40);

  return (
    <div className="chat-panel">
      <div className="chat-header">{title}</div>
      <div className="chat-list">
        {filtered.map((m, i) => (
          <Bubble key={m.id || m.messageId || i} msg={m} />
        ))}
      </div>
    </div>
  );
}

function Bubble({ msg }) {
  const role = (msg.role || "").toLowerCase();
  const sender = msg.sender || (role ? role[0].toUpperCase() + role.slice(1) : "Elyx");
  const isMember = role === "member" || sender.toLowerCase() === "member";

  return (
    <div className={`bubble-row ${isMember ? "right" : "left"}`}>
      <div className="bubble">
        <div className="meta">
          <strong>{sender}</strong>
          <span> · {formatDateTime(msg.timestamp)}</span>
        </div>
        <div className="text">{msg.message || msg.text}</div>
      </div>
    </div>
  );
}

function formatDateTime(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d)) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}