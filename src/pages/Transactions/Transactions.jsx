import { useState, useMemo } from "react";
import AppShell from "../../components/AppShell/AppShell";
import "./Transactions.css";

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    date: "02.10.2025",
    category: "Податки",
    description: "Єдиний податок 5%",
    amount: -1200,
    type: "Витрата",
    status: "Виконано",
    bank: "Monobank"
  },
  {
    id: 2,
    date: "03.10.2025",
    category: "Надходження",
    description: "Оплата від клієнта #-12",
    amount: 8500,
    type: "Дохід",
    status: "Зараховано",
    bank: "Privat"
  },
  {
    id: 3,
    date: "05.10.2025",
    category: "Оренда",
    description: "Консьєрж жилеттю",
    amount: -2500,
    type: "Витрата",
    status: "Очікує",
    bank: "Monobank"
  },
  {
    id: 4,
    date: "09.10.2025",
    category: "Реклама",
    description: "Facebook Ads",
    amount: -1350,
    type: "Витрата",
    status: "Виконано",
    bank: "Privat"
  },
  {
    id: 5,
    date: "12.10.2025",
    category: "Надходження",
    description: "Зарахування #-20",
    amount: 6200,
    type: "Дохід",
    status: "Зараховано",
    bank: "Monobank"
  },
  {
    id: 6,
    date: "15.10.2025",
    category: "За праця",
    description: "Күйспер (Biznes)",
    amount: -200,
    type: "Витрата",
    status: "Виконано",
    bank: "Monobank"
  },
  {
    id: 7,
    date: "18.10.2025",
    category: "Добре послуги",
    description: "Сортинфан EUP",
    amount: -800,
    type: "Витрата",
    status: "Виконано",
    bank: "Privat"
  },
  {
    id: 8,
    date: "21.10.2025",
    category: "Надходження",
    description: "Переплата #550",
    amount: 3400,
    type: "Дохід",
    status: "Очікує",
    bank: "Monobank"
  },
];

export default function Transactions() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    period: "",
    category: ""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(transaction => {
      if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleExport = () => {
    console.log("Експорт транзакцій...");
  };

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 0,
    }).format(absAmount);
  };

  const getTypeClass = (type) => {
    return type === "Дохід" ? "type-income" : "type-expense";
  };

  const getAmountClass = (amount) => {
    return amount > 0 ? "amount-income" : "amount-expense";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Виконано":
      case "Зараховано":
        return "status-completed";
      case "Очікує":
        return "status-pending";
      default:
        return "status-cancelled";
    }
  };

  return (
    <AppShell 
      title="Транзакції"
      actions={
        <button className="btn-export" onClick={handleExport}>
          Застосувати
        </button>
      }
    >
      <div className="transactions-page">
        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="search">Тип</label>
            <input
              id="search"
              type="text"
              name="search"
              className="filter-input"
              placeholder="Дохід / Витрата"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Категорія</label>
            <select
              id="category"
              name="category"
              className="filter-select"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Усі категорії</option>
              <option value="Податки">Податки</option>
              <option value="Надходження">Надходження</option>
              <option value="Оренда">Оренда</option>
              <option value="Реклама">Реклама</option>
              <option value="За праця">За праця</option>
              <option value="Добре послуги">Добре послуги</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="period">Період</label>
            <select
              id="period"
              name="period"
              className="filter-select"
              value={filters.period}
              onChange={handleFilterChange}
            >
              <option value="">01.10.2025 — 31.10.2025</option>
              <option value="today">Сьогодні</option>
              <option value="week">Тиждень</option>
              <option value="month">Місяць</option>
              <option value="quarter">Квартал</option>
              <option value="year">Рік</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search-desc">Пошук</label>
            <input
              id="search-desc"
              type="text"
              name="search"
              className="filter-input"
              placeholder="Назва, опис, ID..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <button className="btn-export" onClick={handleExport}>
            Скинути
          </button>
        </div>

        <div className="transactions-table-wrapper">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">Транзакції не знайдено</div>
              <div className="empty-state-hint">
                Спробуйте змінити фільтри або додайте нові транзакції
              </div>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Категорія</th>
                  <th>Опис</th>
                  <th>Сума</th>
                  <th>Тип</th>
                  <th>Статус</th>
                  <th>Джерело</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="date-cell">{transaction.date}</td>
                    <td className="category-cell">{transaction.category}</td>
                    <td className="description-cell" title={transaction.description}>
                      {transaction.description}
                    </td>
                    <td className={`amount-cell ${getAmountClass(transaction.amount)}`}>
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td>
                      <span className={`type-badge ${getTypeClass(transaction.type)}`}>
                        {transaction.type === "Дохід" ? "● " : "● "}
                        {transaction.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="bank-cell">{transaction.bank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}