import React, { useState } from "react";
import AppShell from "../../components/AppShell/AppShell";
import "./Analytics.css";
import { Icon } from "@iconify/react";

export default function Analytics() {
  const [period, setPeriod] = useState(30);

  const PERIODS = [
    { value: 7, label: "Тиждень" },
    { value: 30, label: "Місяць" },
    { value: 90, label: "Квартал" },
    { value: 180, label: "Піврічча" },
    { value: 365, label: "Рік" },
  ];

  const ICONS = {
    restaurants: "mdi:silverware-fork-knife",
    supermarkets: "mdi:cart-outline",
    fuel: "mdi:gas-station-outline",
    laptop: "mdi:laptop",
    utilities: "mdi:home-outline",
    entertain: "ph:film-strip-duotone",
  };

  const actions = (
    <div style={{ display: "flex", gap: "6px", background: "#f3f4f6", padding: "4px", borderRadius: "10px" }}>
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => setPeriod(p.value)}
          style={{
            padding: "8px 14px",
            background: period === p.value ? "#fff" : "transparent",
            color: period === p.value ? "var(--dark-main)" : "#6b7280",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
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
  );

  const topCategories = [
    {
      rank: 1,
      icon: ICONS.restaurants,
      name: "Ресторани та кафе",
      desc: "Громадське харчування • MCC 5812",
      width: "85%",
      amount: "4 250 ₴",
      count: "12 транзакцій",
    },
    {
      rank: 2,
      icon: ICONS.supermarkets,
      name: "Супермаркети",
      desc: "Продукти харчування • MCC 5411",
      width: "65%",
      amount: "3 181 ₴",
      count: "8 транзакцій",
    },
    {
      rank: 3,
      icon: ICONS.fuel,
      name: "Транспорт та паливо",
      desc: "Автомобільні витрати • MCC 5541",
      width: "55%",
      amount: "2 890 ₴",
      count: "5 транзакцій",
    },
    {
      rank: 4,
      icon: ICONS.laptop,
      name: "Електроніка",
      desc: "Техніка та гаджети • MCC 5732",
      width: "48%",
      amount: "2 500 ₴",
      count: "3 транзакції",
    },
    {
      rank: 5,
      icon: ICONS.utilities,
      name: "Комунальні послуги",
      desc: "Рахунки за послуги • MCC 4900",
      width: "35%",
      amount: "1 850 ₴",
      count: "4 транзакції",
    },
  ];

  const allCategories = [
    {
      icon: ICONS.restaurants,
      trend: "-8%",
      up: false,
      name: "Ресторани",
      parent: "Громадське харчування",
      amount: "4 250 ₴",
      txCount: 12,
      avg: "354 ₴",
      share: "27%",
    },
    {
      icon: ICONS.supermarkets,
      trend: "-3%",
      up: false,
      name: "Супермаркети",
      parent: "Продукти харчування",
      amount: "3 181 ₴",
      txCount: 8,
      avg: "398 ₴",
      share: "20%",
    },
    {
      icon: ICONS.fuel,
      trend: "+12%",
      up: true,
      name: "Транспорт",
      parent: "Автомобільні витрати",
      amount: "2 890 ₴",
      txCount: 5,
      avg: "578 ₴",
      share: "19%",
    },
    {
      icon: ICONS.laptop,
      trend: "+25%",
      up: true,
      name: "Електроніка",
      parent: "Техніка та гаджети",
      amount: "2 500 ₴",
      txCount: 3,
      avg: "833 ₴",
      share: "16%",
    },
    {
      icon: ICONS.utilities,
      trend: "-2%",
      up: false,
      name: "Комунальні",
      parent: "Рахунки за послуги",
      amount: "1 850 ₴",
      txCount: 4,
      avg: "463 ₴",
      share: "12%",
    },
    {
      icon: ICONS.entertain,
      trend: "+5%",
      up: true,
      name: "Розваги",
      parent: "Дозвілля",
      amount: "877 ₴",
      txCount: 2,
      avg: "439 ₴",
      share: "6%",
    },
  ];

  const grew = [
    { icon: ICONS.laptop, name: "Електроніка", value: "+25%" },
    { icon: ICONS.fuel, name: "Транспорт", value: "+12%" },
    { icon: ICONS.entertain, name: "Розваги", value: "+5%" },
  ];

  const decreased = [
    { icon: ICONS.restaurants, name: "Ресторани", value: "-8%" },
    { icon: ICONS.supermarkets, name: "Супермаркети", value: "-3%" },
    { icon: ICONS.utilities, name: "Комунальні", value: "-2%" },
  ];

  return (
    <AppShell title="Аналітика витрат по категоріях" actions={actions}>
      <div className="analytics">

        <div className="top-categories">
          <h2 className="section-title"> Топ-5 категорій витрат</h2>
          {topCategories.map((cat) => (
            <div className="top-category-item" key={cat.rank}>
              <div className="top-category-rank">{cat.rank}</div>
              <div className="top-category-icon">
                <Icon icon={cat.icon} width="36" height="36" />
              </div>
              <div className="top-category-info">
                <div className="top-category-name">{cat.name}</div>
                <div className="top-category-desc">{cat.desc}</div>
                <div className="top-category-bar">
                  <div
                    className="top-category-fill"
                    style={{ width: cat.width }}
                  />
                </div>
              </div>
              <div className="top-category-stats">
                <div className="top-category-amount">{cat.amount}</div>
                <div className="top-category-count">{cat.count}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title"> Всі категорії витрат</h2>
        <div className="categories-grid">
          {allCategories.map((c, idx) => (
            <div className="category-card" key={idx}>
              <div className="category-header">
                <div className="category-icon">
                  <Icon icon={c.icon} width="28" height="28" />
                </div>
                <div className={`category-trend ${c.up ? "up" : ""}`}>
                  {c.trend}
                </div>
              </div>
              <div className="category-name">{c.name}</div>
              <div className="category-parent">{c.parent}</div>
              <div className="category-amount">{c.amount}</div>
              <div className="category-details">
                <div className="category-detail">
                  <div className="category-detail-label">Транзакцій</div>
                  <div className="category-detail-value">{c.txCount}</div>
                </div>
                <div className="category-detail">
                  <div className="category-detail-label">Середня</div>
                  <div className="category-detail-value">{c.avg}</div>
                </div>
                <div className="category-detail">
                  <div className="category-detail-label">% від всього</div>
                  <div className="category-detail-value">{c.share}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}