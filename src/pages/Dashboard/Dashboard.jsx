import { useState, useEffect } from "react";
import AppShell from "../../components/AppShell/AppShell";
import "./Dashboard.css";
import analyticsService from "../../services/analyticsService";
import monobankService from "../../services/monobankService";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    balance: null,
    incomeMonth: null,
    expenseMonth: null,
  });
  const [limit, setLimit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dashboard = await analyticsService.getDashboard(30);

      setMetrics({
        balance: dashboard.income.totalAmount - dashboard.expenses.totalAmount,
        incomeMonth: dashboard.income.totalAmount,
        expenseMonth: dashboard.expenses.totalAmount,
      });

      if (dashboard.limitStatus) {
        setLimit({
          usedPct: dashboard.limitStatus.percentage,
          remainingUAH: dashboard.limitStatus.remaining,
          currentUAH: dashboard.limitStatus.currentIncome,
          limitUAH: dashboard.limitStatus.limit,
        });
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await monobankService.sync();
      await loadData();
    } catch (err) {
      console.error("Sync error:", err);
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (value) => {
    if (value == null) return "—";
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const cards = [
    { 
      label: "Баланс за місяць", 
      value: formatCurrency(metrics.balance),
      className: "card--primary"
    },
    { 
      label: "Дохід за місяць", 
      value: formatCurrency(metrics.incomeMonth),
      className: "card--success"
    },
    { 
      label: "Витрати за місяць", 
      value: formatCurrency(metrics.expenseMonth),
      className: "card--danger"
    },
  ];

  const actions = (
    <button 
      className="sync-btn" 
      onClick={handleSync} 
      disabled={syncing || loading}
      style={{
        padding: "10px 20px",
        background: "var(--accent-primary)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: syncing || loading ? "not-allowed" : "pointer",
        fontWeight: "600",
        opacity: syncing || loading ? 0.6 : 1,
      }}
    >
      {syncing ? "Синхронізація..." : "Оновити дані"}
    </button>
  );

  if (loading && !metrics.balance) {
    return (
      <AppShell title="Дашборд">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "var(--dark-grey)" }}>
            Завантаження даних...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Дашборд">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#e11d48", marginBottom: "16px" }}>
            Помилка: {error}
          </p>
          <button 
            onClick={loadData}
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
    <AppShell title="Дашборд" actions={actions}>
      <section className="grid-cards">
        {cards.map((c) => (
          <article key={c.label} className={`card ${c.className || ""}`}>
            <span className="card__label">{c.label}</span>
            <span className="card__value">{c.value}</span>
          </article>
        ))}
      </section>

      <section className="panel">
        <h3>Динаміка доходів / витрат</h3>
        <div className="chart-placeholder">
          Графік зʼявиться у наступній версії
        </div>
      </section>

      <section className="panel">
        <h3>Ліміт ФОП (річний)</h3>

        {limit == null ? (
          <div className="chart-placeholder">
            {loading ? "Завантаження..." : "Налаштуйте групу ФОП у профілі"}
          </div>
        ) : (
          <div className="limit">
            <div className="limit__bar">
              <span 
                className="limit__fill" 
                style={{ 
                  width: `${Math.min(limit.usedPct, 100)}%`,
                  background: limit.usedPct >= 90 ? "#ef4444" : limit.usedPct >= 80 ? "#f59e0b" : "#22c55e"
                }} 
              />
            </div>
            <div className="limit__meta">
              Використано {limit.usedPct.toFixed(1)}%. 
              Поточний дохід: {formatCurrency(limit.currentUAH)}. 
              Залишилось {formatCurrency(limit.remainingUAH)} до ліміту {formatCurrency(limit.limitUAH)}
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}