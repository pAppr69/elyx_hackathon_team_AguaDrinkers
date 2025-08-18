import React from "react";

export default function EventTimeline({ events, onSelect }) {
  return (
    <ul className="timeline">
      {events.map((e, idx) => (
        <li key={e.id || idx} className="timeline-item" onClick={() => onSelect(e)}>
          <div className="dot" />
          <div className="content">
            <div className="date">{formatDate(e.date)}</div>
            <div className="title">{e.title || e.episodeTitle || "Untitled event"}</div>
            {(e.summary || e.primaryGoalTrigger || e.finalOutcome) && (
              <div className="summary">{e.summary || e.primaryGoalTrigger || e.finalOutcome}</div>
            )}
            {Array.isArray(e.tags) && e.tags.length > 0 && (
              <div className="tags">
                {e.tags.map((t, i) => (
                  <span className="tag" key={i}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}