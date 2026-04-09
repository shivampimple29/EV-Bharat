import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faPaperPlane,
  faXmark,
  faCommentDots,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

const RASA_URL = "https://shivampimple29-evassistant.hf.space/webhooks/rest/webhook";
const SENDER_ID = "ev_user_" + Math.random().toString(36).slice(2, 9);

// Quick-suggest chips shown at start
const QUICK_CHIPS = [
  { label: "⚡ Stations in Mumbai", msg: "Find stations in Mumbai" },
  { label: "🏆 Top Rated", msg: "Show top rated stations" },
  { label: "🔌 CCS Chargers", msg: "Show CCS chargers" },
  { label: "✅ Verified Only", msg: "Show verified stations" },
  { label: "⚡ Fastest Charger", msg: "Show fastest chargers" },
  { label: "📍 Near Me", msg: "Find nearest station" },
];

// Format bot text: bold **text**, line breaks, numbered lists
function formatText(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold **text**
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const formatted = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j}>{p}</strong> : p
    );
    return (
      <span key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      from: "bot",
      text: "Hi! I'm EVA ⚡ your EV charging assistant.\n\nAsk me about charging stations, operators, charger types, and more!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Check RASA reachability
  useEffect(() => {
    fetch("https://shivampimple29-evassistant.hf.space/")
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  // FAB entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const addBotMsg = (msg) => {
    setMsgs((prev) => [...prev, { from: "bot", ...msg }]);
    if (!open) setUnread((n) => n + 1);
  };

  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setMsgs((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);
    setShowChips(false);

    try {
      const res = await fetch(RASA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: SENDER_ID, message: text }),
      });
      const data = await res.json();

      if (!data || data.length === 0) {
        addBotMsg({ text: "I didn't quite get that. Could you rephrase? 🤔" });
      } else {
        data.forEach((item) => {
          if (item.text) addBotMsg({ text: item.text });
          if (item.image) addBotMsg({ image: item.image });
          if (item.buttons) addBotMsg({ buttons: item.buttons });
        });
      }
    } catch {
      addBotMsg({
        text: "⚠️ Could not reach EVA. Make sure Rasa is running on port 5005.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMsgs([
      {
        from: "bot",
        text: "Hi! I'm EVA ⚡ your EV charging assistant.\n\nAsk me about charging stations, operators, charger types, and more!",
      },
    ]);
    setShowChips(true);
    setUnread(0);
  };

  return (
    <>
      {/* ── STYLES ─────────────────────────────────────── */}
      <style>{`
        /* Widget container */
        .eva-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* FAB button */
        .eva-fab {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #00b894, #00838f);
          color: #fff;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,184,148,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
          opacity: 0;
          transform: scale(0.5) translateY(20px);
          position: relative;
        }
        .eva-fab.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .eva-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(0,184,148,0.55);
        }
        .eva-fab:active { transform: scale(0.96); }

        /* Unread badge */
        .eva-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #e74c3c;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          animation: eva-pulse 1.5s infinite;
        }
        @keyframes eva-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* Chat window */
        .eva-window {
            position: absolute;
            bottom: 72px;
            right: 0;

            width: 370px;
            height: clamp(460px, 70vh, 560px); /* responsive + controlled */

            background: #0f1117;

            border-radius: 18px;
            border: none;

            box-shadow:
              0 20px 60px rgba(0, 0, 0, 0.55),
              0 0 0 1px rgba(0, 184, 148, 0.08); /* subtle glow */

            display: flex;
            flex-direction: column;
            overflow: hidden;

            transform-origin: bottom right;
            animation: eva-open 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);

            backdrop-filter: blur(10px); /* premium glass feel */
            -webkit-backdrop-filter: blur(10px);

            will-change: transform, opacity;
          }
        @keyframes eva-open {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Header */
        .eva-header {
          background: linear-gradient(135deg, #00b894 0%, #00838f 100%);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .eva-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color:#fff;
          flex-shrink: 0;
        }
        .eva-header-info { flex: 1; }
        .eva-header-name {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }
        .eva-header-status {
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
        }
        .eva-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ecc71;
          animation: eva-blink 2s infinite;
        }
        .eva-status-dot.offline { background: #e74c3c; animation: none; }
        @keyframes eva-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .eva-header-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          transition: background 0.2s;
        }
        .eva-header-btn:hover { background: rgba(255,255,255,0.25); }

        /* Messages area */
        .eva-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }
        .eva-messages::-webkit-scrollbar { width: 4px; }
        .eva-messages::-webkit-scrollbar-track { background: transparent; }
        .eva-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* Bubbles */
        .eva-bubble-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .eva-bubble-row.user { flex-direction: row-reverse; }
        .eva-bubble-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00b894, #00838f);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #fff;
          flex-shrink: 0;
        }
        .eva-bubble {
          max-width: 82%;
          padding: 10px 13px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.55;
          word-break: break-word;
          white-space: pre-wrap;
        }
        .eva-bubble.bot {
          background: #1e2130;
          color: #e0e0e0;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .eva-bubble.user {
          background: linear-gradient(135deg, #00b894, #00838f);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .eva-bubble img {
          max-width: 100%;
          border-radius: 8px;
          margin-top: 6px;
        }

        /* Quick reply buttons from RASA */
        .eva-quick-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
          padding-left: 36px;
        }
        .eva-qr-btn {
          background: rgba(0,184,148,0.12);
          border: 1px solid rgba(0,184,148,0.35);
          color: #00b894;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12.5px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .eva-qr-btn:hover {
          background: rgba(0,184,148,0.22);
          transform: translateY(-1px);
        }

        /* Quick-suggest chips */
        .eva-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 14px 12px;
        }
        .eva-chip {
          background: rgba(0,184,148,0.08);
          border: 1px solid rgba(0,184,148,0.25);
          color: #00c8a0;
          padding: 5px 11px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .eva-chip:hover {
          background: rgba(0,184,148,0.18);
          transform: translateY(-1px);
        }

        /* Typing indicator */
        .eva-typing {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 4px;
        }
        .eva-typing-dots {
          display: flex;
          gap: 4px;
          background: #1e2130;
          padding: 10px 14px;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .eva-typing-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00b894;
          animation: eva-typing 1.2s infinite;
        }
        .eva-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .eva-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes eva-typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* Input bar */
        .eva-inputbar {
          padding: 12px 14px;
          background: #0f1117;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .eva-input {
          flex: 1;
          background: #1e2130;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 9px 16px;
          color: #e0e0e0;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s;
        }
        .eva-input::placeholder { color: #666; }
        .eva-input:focus { border-color: rgba(0,184,148,0.5); }
        .eva-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #00b894, #00838f);
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(0,184,148,0.4);
        }
        .eva-send-btn:hover { transform: scale(1.08); box-shadow: 0 4px 16px rgba(0,184,148,0.5); }
        .eva-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        /* Footer */
        .eva-footer {
          text-align: center;
          font-size: 11px;
          color: #444;
          padding: 6px 0 10px;
          flex-shrink: 0;
        }
        .eva-footer span { color: #00b894; }

        /* Mobile responsive */
        @media (max-width: 420px) {
          .eva-widget { bottom: 16px; right: 16px; }
          .eva-window { width: calc(100vw - 32px); height: 70vh; right: 0; }
        }
      `}</style>

      {/* ── WIDGET ─────────────────────────────────────── */}
      <div className="eva-widget">

        {/* Chat window */}
        {open && (
          <div className="eva-window">

            {/* Header */}
            <div className="eva-header">
              <div className="eva-avatar">
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <div className="eva-header-info">
                <div className="eva-header-name">EVA — EV Assistant</div>
                <div className="eva-header-status">
                  <span className={`eva-status-dot ${online ? "" : "offline"}`} />
                  {online ? "Online · Ready to help" : "Connecting..."}
                </div>
              </div>
              <button className="eva-header-btn" onClick={resetChat} title="Reset chat">
                <FontAwesomeIcon icon={faRotateRight} />
              </button>
              <button className="eva-header-btn" onClick={() => setOpen(false)} title="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Messages */}
            <div className="eva-messages">
              {msgs.map((m, i) => (
                <div key={i}>
                  {/* Text bubble */}
                  {m.text && (
                    <div className={`eva-bubble-row ${m.from}`}>
                      {m.from === "bot" && (
                        <div className="eva-bubble-icon">
                          <FontAwesomeIcon icon={faBolt} />
                        </div>
                      )}
                      <div className={`eva-bubble ${m.from}`}>
                        {formatText(m.text)}
                        {m.image && <img src={m.image} alt="station" />}
                      </div>
                    </div>
                  )}
                  {/* Quick reply buttons from RASA */}
                  {m.buttons && (
                    <div className="eva-quick-replies">
                      {m.buttons.map((b, bi) => (
                        <button
                          key={bi}
                          className="eva-qr-btn"
                          onClick={() => sendMessage(b.payload || b.title)}
                        >
                          {b.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="eva-typing">
                  <div className="eva-bubble-icon">
                    <FontAwesomeIcon icon={faBolt} />
                  </div>
                  <div className="eva-typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick-suggest chips */}
            {showChips && (
              <div className="eva-chips">
                {QUICK_CHIPS.map((c, i) => (
                  <button key={i} className="eva-chip" onClick={() => sendMessage(c.msg)}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="eva-inputbar">
              <input
                ref={inputRef}
                className="eva-input"
                placeholder="Ask about EV stations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <button
                className="eva-send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>

            {/* Footer */}
            <div className="eva-footer">
              Powered by <span>EV Bharat</span> · Rasa AI
            </div>
          </div>
        )}

        {/* FAB */}
        <button
          className={`eva-fab ${visible ? "visible" : ""}`}
          onClick={() => setOpen((o) => !o)}
          title="Chat with EVA"
        >
          <FontAwesomeIcon icon={open ? faXmark : faCommentDots} />
          {!open && unread > 0 && (
            <span className="eva-badge">{unread}</span>
          )}
        </button>
      </div>
    </>
  );
}

export default Chatbot;
