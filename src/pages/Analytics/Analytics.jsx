import { useState, useEffect } from "react";
import AppShell from "../../components/AppShell/AppShell";
import IncomeExpenseLineChart from "../../components/IncomeExpenseChart/IncomeExpenseChart";
import analyticsService from "../../services/analyticsService";
import "./Analytics.css";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(30);
  
  const [dashboardData, setDashboardData] = useState({
    income: { totalAmount: 0, totalTransactions: 0 },
    expenses: { totalAmount: 0, totalTransactions: 0 },
    netIncome: 0,
    topCategories: [],
    dailyTrends: [],
    limitStatus: null
  });

  const [incomeVsExpenses, setIncomeVsExpenses] = useState([]);
  const [limitUtilization, setLimitUtilization] = useState(null);

  const PERIODS = [
    { value: 7, label: "Тиждень" },
    { value: 30, label: "Місяць" },
    { value: 90, label: "Квартал" },
    { value: 180, label: "Півріччя" },
    { value: 365, label: "Рік" },
  ];

  useEffect(() => {
    loadAllData();
  }, [period]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboard, incomeVsExp, limitUtil] = await Promise.all([
        analyticsService.getDashboard(period),
        analyticsService.getIncomeVsExpenses('month', 12),
        analyticsService.getLimitUtilization(new Date().getFullYear())
      ]);

      setDashboardData(dashboard);
      setIncomeVsExpenses(incomeVsExp.data || []);
      setLimitUtilization(limitUtil);
    } catch (err) {
      console.error('Analytics load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value == null) return "—";
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getPeriodLabel = () => {
    const periodObj = PERIODS.find(p => p.value === period);
    return periodObj ? periodObj.label.toLowerCase() : "період";
  };

  const getLimitStatusColor = (percentage) => {
    if (percentage >= 100) return "#ef4444";
    if (percentage >= 90) return "#f59e0b";
    if (percentage >= 80) return "#fbbf24";
    return "#22c55e";
  };

  const getLimitStatusText = (percentage) => {
    if (percentage >= 100) return "Перевищено";
    if (percentage >= 90) return "Критично";
    if (percentage >= 80) return "Попередження";
    return "Норма";
  };

  if (loading && !dashboardData.income.totalAmount) {
    return (
      <AppShell title="Аналітика">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "var(--dark-grey)" }}>
            Завантаження аналітики...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Аналітика">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#e11d48", marginBottom: "16px" }}>
            Помилка: {error}
          </p>
          <button 
            onClick={() => loadAllData()}
            style={{
              padding: "10px 20px",
              background: "var(--accent-primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Спробувати ще раз
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell 
      title="Аналітика"
      actions={
        <div style={{ display: "flex", gap: "6px", background: "#f3f4f6", padding: "4px", borderRadius: "10px" }}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              disabled={loading}
              style={{
                padding: "8px 14px",
                background: period === p.value ? "#fff" : "transparent",
                color: period === p.value ? "var(--dark-main)" : "#6b7280",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: period === p.value ? "700" : "500",
                transition: "all 0.2s",
                boxShadow: period === p.value ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="analytics-page">
        
        <section className="panel_analytics">
          <h3>Топ-5 категорій витрат</h3>
          {dashboardData.topCategories && dashboardData.topCategories.length > 0 ? (
            <div className="categories-list">
              {dashboardData.topCategories.map((category, idx) => {
                const total = dashboardData.expenses.totalAmount || 1;
                const percentage = (category.totalSpent / total) * 100;
                
                return (
                  <div key={idx} className="category-item">
                    <div className="category-info">
                      <span className="category-name">{category.category || "Без категорії"}</span>
                      <span className="category-count">{category.transactionCount} транзакцій</span>
                    </div>
                    <div className="category-amount">
                      <span>{formatCurrency(category.totalSpent)}</span>
                      <span className="category-percent">{formatPercent(percentage)}</span>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-bar-fill" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="chart-empty">Немає даних про категорії витрат</div>
          )}
        </section>

      </div>
    </AppShell>
  );
}