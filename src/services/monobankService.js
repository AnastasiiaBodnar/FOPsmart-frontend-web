import { API_URL, getAuthHeader } from "../config/api";

const monobankService = {
  async connect(token) {
    const response = await fetch(`${API_URL}/api/monobank/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Помилка підключення");
    }

    return data;
  },

  async getStatus() {
    const response = await fetch(`${API_URL}/api/monobank/status`, {
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Помилка отримання статусу");
    }

    return data;
  },

  async sync() {
    const response = await fetch(`${API_URL}/api/monobank/sync`, {
      method: "POST",
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Помилка синхронізації");
    }

    return data;
  },

  async disconnect() {
    const response = await fetch(`${API_URL}/api/monobank/disconnect`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Помилка відключення");
    }

    return data;
  },
};

export default monobankService;