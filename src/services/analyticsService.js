import { API_URL, getAuthHeader } from "../config/api";

const analyticsService = {
  async getDashboard(days = 30) {
    const response = await fetch(
      `${API_URL}/api/analytics/dashboard?days=${days}`,
      {
        headers: getAuthHeader(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Помилка завантаження даних");
    }

    return data;
  },

  async getIncomeVsExpenses(groupBy = "month", limit = 12) {
    const response = await fetch(
      `${API_URL}/api/analytics/income-vs-expenses?groupBy=${groupBy}&limit=${limit}`,
      {
        headers: getAuthHeader(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Помилка завантаження даних");
    }

    return data;
  },

  async getLimitUtilization(year = new Date().getFullYear()) {
    const response = await fetch(
      `${API_URL}/api/analytics/limit-utilization?year=${year}`,
      {
        headers: getAuthHeader(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Помилка завантаження даних");
    }

    return data;
  },
};

export default analyticsService;