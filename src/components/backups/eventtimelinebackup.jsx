export default function EventTimeline({ events, onSelect }) {
    return (
      <ul className="timeline">
        {events.map((e) => (
          <li key={e.id} className="timeline-item" onClick={() => onSelect(e)}>
            <div className="dot" />
            <div className="content">
              <div className="date">{formatDate(e.date)}</div>
              <div className="title">{e.title}</div>
              {e.summary && <div className="summary">{e.summary}</div>}
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
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }