import React, { useState } from "react";

// Lightweight local QA using your JSON as context.
// If you later add a backend (Gemini), we'll swap fetch() in sendMessage().
export default function JudgeChat({ journey, chats }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    const q = input.trim();
    if (!q) return;
    const userMsg = { role: "judge", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      // --- v1: local heuristic answer (no backend required) ---
      const answer = localAnswer(q, journey, chats);
      const botMsg = { role: "elyx-ai", text: answer };
      setMessages((m) => [...m, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "elyx-ai", text: "Sorry—couldn’t process that question." },
      ]);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-panel" style={{ marginTop: 16 }}>
      <div className="chat-header">Ask Elyx AI (Judge Q&A)</div>

      <div className="chat-list">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input" style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='Ask e.g. "Why was this med prescribed?"'
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={sendMessage}>Ask</button>
      </div>
    </div>
  );
}

// --- simple local retrieval + template answer ---
function localAnswer(question, journey, chats) {
  const q = question.toLowerCase();

  // score function by keyword overlap
  const scoreText = (q, text) => {
    if (!text) return 0;
    const words = q.split(/\W+/).filter(Boolean);
    const s = String(text).toLowerCase();
    return words.reduce((acc, w) => acc + (s.includes(w) ? 1 : 0), 0);
  };

  const eventScores = (journey || []).map((e) => {
    const bag = [
      e.title,
      e.summary,
      e.decision,
      e.rationale,
      (e.metrics || []).join(" "),
      (e.tags || []).join(" "),
    ].join(" || ");
    return { e, score: scoreText(q, bag) };
  }).sort((a, b) => b.score - a.score);

  const chatScores = (chats || []).map((m) => {
    const bag = [m.message || m.text || "", m.sender || m.role || ""].join(" || ");
    return { m, score: scoreText(q, bag) };
  }).sort((a, b) => b.score - a.score);

  const topEvent = eventScores[0]?.e;
  const topChats = chatScores.slice(0, 3).map((x) => x.m);

  // Heuristic intent
  const askWhyMed = q.includes("why") && (q.includes("med") || q.includes("medicine") || q.includes("prescrib"));

  if (topEvent) {
    const title = topEvent.title || "this episode";
    const date = topEvent.date ? new Date(topEvent.date).toLocaleDateString() : null;
    const decision = topEvent.decision || topEvent.finalOutcome || "";
    const rationale = topEvent.rationale || topEvent.primaryGoalTrigger || "";
    const metrics = (topEvent.metrics || []).join("; ");

    if (askWhyMed) {
      return [
        `Based on ${date ? `the ${date} ` : ""}${title}:`,
        decision ? `• Decision: ${decision}` : null,
        rationale ? `• Rationale: ${rationale}` : null,
        metrics ? `• Metrics considered: ${metrics}` : null,
        topChats.length
          ? `• Evidence: referenced ${topChats.length} related chat${topChats.length > 1 ? "s" : ""} (e.g., “${snippet(topChats[0].message || topChats[0].text)}”).`
          : null,
        `If you want a specific medication’s reasoning, ask e.g. “Why was <med-name> started?”`,
      ].filter(Boolean).join("\n");
    }

    return [
      `Closest context: ${title}${date ? ` (${date})` : ""}.`,
      decision ? `Decision: ${decision}` : null,
      rationale ? `Rationale: ${rationale}` : null,
      metrics ? `Metrics: ${metrics}` : null,
      topChats.length
        ? `Related chat: “${snippet(topChats[0].message || topChats[0].text)}”`
        : null,
    ].filter(Boolean).join("\n");
  }

  return "I couldn’t find a directly relevant episode. Try being more specific (episode number, metric, or medication name).";
}

function snippet(s, n = 120) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}