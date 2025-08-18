import React, { useEffect, useState, useMemo } from "react";
import EventTimeline from "./components/EventTimeline";
import RationaleModal from "./components/RationaleModal";
import ChatViewer from "./components/ChatViewer";
import JudgeChat from "./components/JudgeChat";
import StatusPanel from "./components/StatusPanel";
import "./styles.css";

// Map your journey.json (which uses "episodes") into the UI's expected event shape
function normalizeJourney(jData) {
  if (Array.isArray(jData)) return jData;
  if (Array.isArray(jData.events)) return jData.events;
  if (Array.isArray(jData.episodes)) {
    return jData.episodes.map((e, idx) => ({
      id: e.id || e.episodeId || `ep-${e.episodeNumber ?? idx + 1}`,
      date: e.date || null,
      title: e.episodeTitle || e.title || `Episode ${e.episodeNumber ?? idx + 1}`,
      summary: e.summary || e.primaryGoalTrigger || e.finalOutcome || "",
      decision: e.decision || e.finalOutcome || "",
      rationale:
        e.rationale ||
        (e.statefulPersonaAnalysis
          ? `Before: ${e.statefulPersonaAnalysis.beforeState} → After: ${e.statefulPersonaAnalysis.afterState}`
          : ""),
      chatRefs: e.chatRefs || e.chatIds || [], // optional link to chats
      tags: e.tags || [],
      metrics: (e.metrics || [])
        .map((m) => (typeof m === "string" ? m : `${m.metricName}: ${m.metricValue}`))
        .filter(Boolean),
      status: e.status || null,
    }));
  }
  return [];
}

function sortEvents(events) {
  // robust sort: if no date, keep original order
  return [...events]
    .map((e, i) => ({ ...e, __i: i }))
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : NaN;
      const db = b.date ? new Date(b.date).getTime() : NaN;
      if (isNaN(da) && isNaN(db)) return a.__i - b.__i;
      if (isNaN(da)) return 1;
      if (isNaN(db)) return -1;
      return da - db;
    });
}

export default function App() {
  const [journey, setJourney] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [jRes, cRes] = await Promise.all([
          fetch("/data/journey.json"),
          fetch("/data/chats.json"),
        ]);
        const [jData, cData] = await Promise.all([jRes.json(), cRes.json()]);
        setJourney(normalizeJourney(jData));
        setChats(Array.isArray(cData) ? cData : cData.messages || cData.chatHistory || []);
      } catch (e) {
        console.error("Failed loading data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sortedEvents = useMemo(() => sortEvents(journey), [journey]);

  const currentStatus = useMemo(() => {
    const last = sortedEvents[sortedEvents.length - 1];
    return last?.status || null;
  }, [sortedEvents]);

  if (loading) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <header>
        <h1>Elyx Member Journey</h1>
        <p>Click any event to see the rationale &amp; linked chats.</p>
      </header>

      <StatusPanel status={currentStatus} />

      <div className="layout">
        <div className="left">
          <EventTimeline events={sortedEvents} onSelect={setSelectedEvent} />
        </div>
        <div className="right">
          <ChatViewer
            chats={chats}
            filterIds={selectedEvent?.chatRefs || null}
            title={selectedEvent ? `Linked Chats for: ${selectedEvent.title}` : "Recent Chats"}
          />
          <JudgeChat journey={sortedEvents} chats={chats} />
        </div>
      </div>

      <RationaleModal eventItem={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}