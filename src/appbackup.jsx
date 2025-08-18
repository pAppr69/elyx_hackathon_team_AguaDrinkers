import React from "react";
import { useEffect, useState, useMemo } from "react";
import EventTimeline from "./components/EventTimeline";
import RationaleModal from "./components/RationaleModal";
import ChatViewer from "./components/ChatViewer";
import StatusPanel from "./components/StatusPanel";
import "./styles.css";

// export default function App() {
//     return (
//       <div style={{ padding: "20px", backgroundColor: "white", color: "black" }}>
//         <h1>Hello Elyx 🚀</h1>
//       </div>
//     );
//   }

// -------------------------------------------------------------------------------- // 

// export default function App() {
//   const [journey, setJourney] = useState([]);   // events
//   const [chats, setChats] = useState([]);       // messages
//   const [loading, setLoading] = useState(true);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [jRes, cRes] = await Promise.all([
//           fetch("/data/journey.json"),
//           fetch("/data/chats.json"),
//         ]);
//         const [jData, cData] = await Promise.all([jRes.json(), cRes.json()]);
//         setJourney(Array.isArray(jData) ? jData : jData.events || []);
//         setChats(Array.isArray(cData) ? cData : cData.messages || []);
//       } catch (e) {
//         console.error("Failed loading data", e);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   const sortedEvents = useMemo(() => {
//     return [...journey].sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [journey]);

//   const currentStatus = useMemo(() => {
//     // naive: take the last event’s status snapshot if present
//     const last = sortedEvents[sortedEvents.length - 1];
//     return last?.status || null; // e.g., { plan:"...", meds:[...], nextTests:[...] }
//   }, [sortedEvents]);

//   if (loading) return <div className="container">Loading…</div>;

//   return (
//     <div className="container">
//       <header>
//         <h1>Elyx Member Journey</h1>
//         <p>Click any event to see the rationale & linked chats.</p>
//       </header>

//       <StatusPanel status={currentStatus} />

//       <div className="layout">
//         <div className="left">
//           <EventTimeline events={sortedEvents} onSelect={setSelectedEvent} />
//         </div>
//         <div className="right">
//           <ChatViewer
//             chats={chats}
//             filterIds={selectedEvent?.chatRefs || null}
//             title={selectedEvent ? `Linked Chats for: ${selectedEvent.title}` : "Recent Chats"}
//           />
//         </div>
//       </div>

//       <RationaleModal
//         eventItem={selectedEvent}
//         onClose={() => setSelectedEvent(null)}
//         chats={chats}
//       />
//     </div>
//   );
// }


// ---------------------------------------------------------------------------------//

export default function App() {
    const [journey, setJourney] = useState([]);   // events
    const [chats, setChats] = useState([]);       // messages
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
          setJourney(Array.isArray(jData) ? jData : jData.events || []);
          setChats(Array.isArray(cData) ? cData : cData.messages || []);
        } catch (e) {
          console.error("Failed loading data", e);
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []);
  
    const sortedEvents = useMemo(() => {
      return [...journey].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [journey]);
  
    const currentStatus = useMemo(() => {
      // naive: take the last event’s status snapshot if present
      const last = sortedEvents[sortedEvents.length - 1];
      return last?.status || null; // e.g., { plan:"...", meds:[...], nextTests:[...] }
    }, [sortedEvents]);
  
    if (loading) return <div className="container">Loading…</div>;
  
    return (
      <div className="container">
        <header>
          <h1>Elyx Member Journey</h1>
          <p>Click any event to see the rationale & linked chats.</p>
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
          </div>
        </div>
  
        <RationaleModal
          eventItem={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          chats={chats}
        />
      </div>
    );
  }