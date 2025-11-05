import { useState, useEffect, useRef } from "react";
import AppShell from "../../components/AppShell/AppShell";
import ChatBubble from "../../components/Chat/ChatBubble";
import ChatInput from "../../components/Chat/ChatInput";
import aiService from "../../services/aiService";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Привіт! Я AI-асистент FOPSmart. Можу допомогти з питаннями про ФОП, податки, та вашу фінансову статистику. Про що хочете дізнатися?",
      time: new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiHealth, setAiHealth] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkAiHealth();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAiHealth = async () => {
    try {
      const health = await aiService.healthCheck();
      console.log("AI Health:", health);
      setAiHealth(health);
    } catch (error) {
      console.error("AI Health check failed:", error);
      setAiHealth({ status: "unhealthy", error: error.message });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      text: text,
      time: new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(text);

      const botMessage = {
        role: "bot",
        text: response.answer,
        time: new Date().toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        metadata: {
          queryType: response.query_type,
          confidence: response.confidence,
        },
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Додаємо повідомлення про помилку
      const errorMessage = {
        role: "bot",
        text: "Вибачте, сталася помилка при обробці вашого запиту. Спробуйте ще раз або перефразуйте питання.",
        time: new Date().toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "bot",
        text: "Чат очищено. Чим можу допомогти?",
        time: new Date().toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <AppShell
      title="AI-чат"
      actions={
        <div className="chat-actions">
          {aiHealth && aiHealth.status !== "healthy" && (
            <span className="ai-status ai-status--offline">
               AI сервіс недоступний
            </span>
          )}
          {aiHealth && aiHealth.status === "healthy" && (
            <span className="ai-status ai-status--online">
              ✓ AI підключений
            </span>
          )}
          <button onClick={clearChat} className="btn-clear">
            Очистити чат
          </button>
        </div>
      }
    >
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              role={msg.role}
              text={msg.text}
              time={msg.time}
            />
          ))}
          
          {isLoading && (
            <div className="chat-loading">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-wrapper">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </AppShell>
  );
}