import { useEffect, useMemo, useRef, useState } from "react";
import AppShell from "../../components/AppShell/AppShell";
import ChatBubble from "../../components/Chat/ChatBubble.jsx";
import ChatInput from "../../components/Chat/ChatInput.jsx";
import { aiChat } from "../../services/aiService.js";
import "./Chat.css";

export default function Chat() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chat:ai")) ?? []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("chat:ai", JSON.stringify(items));
  }, [items]);

  const listRef = useRef(null);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [items]);

  const busy = useMemo(() => items.some(m => m.role === "assistant" && m.loading), [items]);

  const send = async (text) => {
    const userMsg = { id: crypto.randomUUID(), role: "user", text, time: ts() };
    setItems(s => [...s, userMsg, { id: "pending", role: "assistant", text: "Думаю…", loading: true }]);

    try {
      const reply = await aiChat([...items, userMsg]);
      setItems(s => s.map(m => m.id === "pending"
        ? { id: crypto.randomUUID(), role: "assistant", text: reply.text, time: ts() }
        : m
      ));
    } catch (e) {
      setItems(s => s.map(m => m.id === "pending"
        ? { id: crypto.randomUUID(), role: "assistant", text: "Помилка відповіді. Спробуйте ще раз.", time: ts(), error: true }
        : m
      ));
      console.error(e);
    }
  };

  return (
    <AppShell title="AI чат">
      <section className="ai-chat">
        {items.length === 0 && (
          <div className="ai-chat__starter">
            <button onClick={() => send("Які є групи ФОП?")}>Які є групи ФОП?</button>
            <button onClick={() => send("Поясни коротко, яка група для IT-ФОП?")}>
              Поясни коротко, яка група для IT-ФОП?
            </button>
          </div>
        )}

        <div className="ai-chat__list" ref={listRef}>
          {items.map(m => (
            <ChatBubble
              key={m.id}
              role={m.role === "assistant" ? "bot" : "user"}
              text={m.text}
              time={m.time}
            />
          ))}
        </div>

        <div className="ai-chat__input">
          <ChatInput onSend={send} disabled={busy} />
        </div>
      </section>
    </AppShell>
  );
}

function ts() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
