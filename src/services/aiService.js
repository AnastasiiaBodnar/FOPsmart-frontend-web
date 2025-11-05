import { getAuthHeader } from "../config/api";

const AI_API_URL = import.meta.env.PROD 
  ? "https://fopsmart-backend-ai.onrender.com" 
  : "https://fopsmart-backend-ai.onrender.com";

const aiService = {

  async sendMessage(query) {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      console.log("Sending to AI:", `${AI_API_URL}/api/chat`);

      const response = await fetch(`${AI_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          query: query,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка при обробці запиту");
      }

      return data;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async classifyQuery(query) {
    try {
      const response = await fetch(`${AI_API_URL}/api/classify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка класифікації");
      }

      return data;
    } catch (error) {
      console.error("Classification Error:", error);
      throw error;
    }
  },


  async healthCheck() {
    try {
      const response = await fetch(`${AI_API_URL}/api/health`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("AI сервіс недоступний");
      }

      return data;
    } catch (error) {
      console.error("Health Check Error:", error);
      return { status: "unhealthy", error: error.message };
    }
  },
};

export default aiService;