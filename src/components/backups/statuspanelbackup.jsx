export default function StatusPanel({ status }) {
    if (!status) return null;
    const { plan, meds, nextTests, notes } = status;
    return (
      <div className="status">
        <div>
          <div className="status-title">Current Status</div>
          {plan && <div><strong>Plan:</strong> {plan}</div>}
          {Array.isArray(meds) && meds.length > 0 && (
            <div><strong>Medications:</strong> {meds.join(", ")}</div>
          )}
          {Array.isArray(nextTests) && nextTests.length > 0 && (
            <div><strong>Upcoming Tests:</strong> {nextTests.join(", ")}</div>
          )}
          {notes && <div><strong>Notes:</strong> {notes}</div>}
        </div>
      </div>
    );
  }