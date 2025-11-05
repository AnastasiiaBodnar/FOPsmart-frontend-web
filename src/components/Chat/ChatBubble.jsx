export default function ChatBubble({ role, text, time }) {
  const isUser = role === "user";
  return (
    <div className={`chat-bubble ${isUser ? "is-user" : "is-bot"}`}>
      <div className="chat-bubble__inner">
        <p className="chat-bubble__text">{text}</p>
        {time && <span className="chat-bubble__time">{time}</span>}
      </div>
    </div>
  );
}
