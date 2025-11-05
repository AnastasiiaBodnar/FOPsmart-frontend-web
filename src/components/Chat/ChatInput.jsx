import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const send = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={`chat-input ${disabled ? "is-disabled" : ""}`}>
      <textarea
        placeholder="Запитайте щось…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        rows={1}
        style={{ resize: "none", flex: 1, border: "none", background: "transparent", outline: "none",
                 font: "inherit", padding: "8px 10px", minHeight: 38, maxHeight: 150 }}
      />
      <button onClick={send} aria-label="Send" disabled={disabled}>➤</button>
      <style>{`
        .chat-input{display:flex;gap:8px;align-items:flex-end;background:#f7f9fb;border:1px solid #e8edf2;border-radius:16px;padding:8px;}
        .chat-input button{border:none;border-radius:12px;padding:10px 14px;background:#2a2e5b;color:#fff;font-weight:800;cursor:pointer;}
        .chat-input.is-disabled{opacity:.6;pointer-events:none;}
      `}</style>
    </div>
  );
}
