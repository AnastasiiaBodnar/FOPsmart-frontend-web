function parseMarkdown(text) {
  if (!text) return "";
  
  let html = text;
  
  // Заголовки
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Жирний текст
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
  
  // Курсив
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
  
  // Код (inline)
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Списки (нумеровані)
  html = html.replace(/^\d+\.\s+(.*$)/gim, '<li class="ordered-list-item">$1</li>');
  
  // Списки (маркеровані)
  html = html.replace(/^[\*\-]\s+(.*$)/gim, '<li class="unordered-list-item">$1</li>');
  
  // Посилання
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Переноси рядків
  html = html.replace(/\n/g, '<br />');
  
  // Обгортаємо списки в ul/ol
  html = html.replace(/(<li class="ordered-list-item">.*?<\/li>)/gs, (match) => {
    return `<ol>${match}</ol>`;
  });
  
  html = html.replace(/(<li class="unordered-list-item">.*?<\/li>)/gs, (match) => {
    return `<ul>${match}</ul>`;
  });
  
  return html;
}

export default function ChatBubble({ role, text, time, isError }) {
  const isUser = role === "user";
  
  const content = isUser ? text : parseMarkdown(text);

  return (
    <div className={`chat-bubble ${isUser ? "is-user" : "is-bot"} ${isError ? "is-error" : ""}`}>
      <div className="chat-bubble__inner">
        {isUser ? (
          <div className="chat-bubble__text">{text}</div>
        ) : (
          <div 
            className="chat-bubble__text"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {time && <span className="chat-bubble__time">{time}</span>}
      </div>
    </div>
  );
}