import { useState, useEffect } from "react";
import AppShell from "../../components/AppShell/AppShell";
import "./Dashboard.css";

export default function Dashboard() {

  const [metrics, setMetrics] = useState({
    balance: null,
    incomeMonth: null,
    expenseMonth: null,
  });
  const [limit, setLimit] = useState(null); 

  // Приклад місця, де з’явиться фетч:
  // useEffect(() => {
  //   fetch("/api/dashboard/summary").then(r => r.json()).then(data => {
  //     setMetrics({
  //       balance: data.balance,
  //       incomeMonth: data.incomeMonth,
  //       expenseMonth: data.expenseMonth,
  //     });
  //     setLimit(data.limit); // { usedPct, remainingUAH }
  //   });
  // }, []);


  const cards = [
    { label: "Баланс", value: metrics.balance },
    { label: "Дохід за місяць", value: metrics.incomeMonth },
    { label: "Витрати за місяць", value: metrics.expenseMonth },
  ];

  return (
    <AppShell title="Дашборд">
      <section className="grid-cards">
        {cards.map((c) => (
          <article key={c.label} className="card">
            <span className="card__label">{c.label}</span>
            <span className="card__value">
              {c.value == null ? "—" : c.value}
            </span>
          </article>
        ))}
      </section>

      <section className="panel">
        <h3>Динаміка доходів / витрат</h3>
        <div className="chart-placeholder">Дані зʼявляться після підключення бекенду</div>
      </section>

      <section className="panel">
        <h3>Ліміт ФОП (річний)</h3>

        {limit == null ? (
          <div className="chart-placeholder">Дані зʼявляться після підключення бекенду</div>
        ) : (
          <div className="limit">
            <div className="limit__bar">
              <span className="limit__fill" style={{ width: `${limit.usedPct}%` }} />
            </div>
            <div className="limit__meta">
              Використано {limit.usedPct}%. Залишилось {limit.remainingUAH.toLocaleString("uk-UA")} ₴
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
