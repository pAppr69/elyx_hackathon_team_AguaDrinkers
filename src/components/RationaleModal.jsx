import React from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

export default function RationaleModal({ eventItem, onClose }) {
  return (
    <Modal
      isOpen={!!eventItem}
      onRequestClose={onClose}
      contentLabel="Event Details"
      className="modal"
      overlayClassName="overlay"
    >
      {!eventItem ? null : (
        <div>
          <h2>{eventItem.title || eventItem.episodeTitle || "Event"}</h2>
          <p className="modal-date">{formatDate(eventItem.date)}</p>

          {eventItem.decision && (
            <>
              <h4>Decision</h4>
              <p>{eventItem.decision}</p>
            </>
          )}

          {(eventItem.rationale || eventItem.primaryGoalTrigger) && (
            <>
              <h4>Rationale</h4>
              <p>{eventItem.rationale || eventItem.primaryGoalTrigger}</p>
            </>
          )}

          {Array.isArray(eventItem.metrics) && eventItem.metrics.length > 0 && (
            <>
              <h4>Metrics</h4>
              <ul>
                {eventItem.metrics.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </>
          )}

          <button className="btn" onClick={onClose}>Close</button>
        </div>
      )}
    </Modal>
  );
}

function formatDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}