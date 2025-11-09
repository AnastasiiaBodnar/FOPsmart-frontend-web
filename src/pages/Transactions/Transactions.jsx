import { useState, useEffect, useMemo } from "react";
import AppShell from "../../components/AppShell/AppShell";
import transactionsService from "../../services/transactionsService";
import "./Transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50
  });

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    category: "",
    fopOnly: true
  });

  useEffect(() => {
    loadTransactions();
  }, [pagination.page]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (pagination.page - 1) * pagination.limit;
      
      const data = await transactionsService.getTransactions({
        ...filters,
        type: filters.type || 'all',
        limit: pagination.limit,
        offset: offset,
        fopOnly: filters.fopOnly
      });

      setTransactions(data.transactions || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0
      }));
    } catch (err) {
      console.error('Load transactions error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadTransactions();
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      dateFrom: "",
      dateTo: "",
      category: "",
      fopOnly: true
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => loadTransactions(), 100);
  };

  const handleExport = () => {
    console.log("Експорт транзакцій...");
    transactionsService.exportToCsv(filters);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getTypeClass = (amount) => {
    return amount > 0 ? "type-income" : "type-expense";
  };

  const getAmountClass = (amount) => {
    return amount > 0 ? "amount-income" : "amount-expense";
  };

  const getStatusBadge = (hold) => {
    if (hold) {
      return <span className="status-badge status-pending">Очікує</span>;
    }
    return <span className="status-badge status-completed">Виконано</span>;
  };

  if (loading && transactions.length === 0) {
    return (
      <AppShell title="Транзакції">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "var(--dark-grey)" }}>
            Завантаження транзакцій...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Транзакції">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#e11d48", marginBottom: "16px" }}>
            Помилка: {error}
          </p>
          <button 
            onClick={loadTransactions}
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
      title="Транзакції"
      actions={
        <button className="btn-export" onClick={handleExport}>
          Експорт
        </button>
      }
    >
      <div className="transactions-page">
        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="type">Тип</label>
            <select
              id="type"
              name="type"
              className="filter-select"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Всі типи</option>
              <option value="income">Дохід</option>
              <option value="expense">Витрата</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dateFrom">Від дати</label>
            <input
              id="dateFrom"
              type="date"
              name="dateFrom"
              className="filter-input"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="dateTo">До дати</label>
            <input
              id="dateTo"
              type="date"
              name="dateTo"
              className="filter-input"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="search">Пошук</label>
            <input
              id="search"
              type="text"
              name="search"
              className="filter-input"
              placeholder="Назва, опис..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <button className="btn-export" onClick={applyFilters} disabled={loading}>
            {loading ? "Завантаження..." : "Застосувати"}
          </button>

          <button 
            className="btn-export" 
            onClick={resetFilters} 
            disabled={loading}
            style={{ background: "#f3f4f6", color: "var(--dark-main)" }}
          >
            Скинути
          </button>
        </div>

        <div className="transactions-table-wrapper">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">Транзакції не знайдено</div>
              <div className="empty-state-hint">
                {filters.fopOnly 
                  ? "Спробуйте змінити фільтри або додайте транзакції на ФОП рахунок"
                  : "Спробуйте змінити фільтри або синхронізуйте транзакції"}
              </div>
            </div>
          ) : (
            <>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Категорія</th>
                    <th>Опис</th>
                    <th>Сума</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th>Рахунок</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="date-cell">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="category-cell">
                        {transaction.category || 'Без категорії'}
                      </td>
                      <td className="description-cell" title={transaction.description}>
                        {transaction.description}
                        {transaction.comment && (
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            {transaction.comment}
                          </div>
                        )}
                      </td>
                      <td className={`amount-cell ${getAmountClass(transaction.amount)}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <span className={`type-badge ${getTypeClass(transaction.amount)}`}>
                          {transaction.amount > 0 ? "● Дохід" : "● Витрата"}
                        </span>
                      </td>
                      <td>
                        {getStatusBadge(transaction.hold)}
                      </td>
                      <td className="bank-cell">
                        {transaction.account?.type === 'fop' ? ' ФОП' : ' Особистий'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination.total > pagination.limit && (
                <div style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1 || loading}
                    style={{
                      padding: '8px 16px',
                      background: pagination.page === 1 ? '#f3f4f6' : 'var(--accent-primary)',
                      color: pagination.page === 1 ? '#999' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    ← Назад
                  </button>

                  <span style={{ color: 'var(--dark-grey)', fontWeight: '500' }}>
                    Сторінка {pagination.page} з {Math.ceil(pagination.total / pagination.limit)}
                  </span>

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || loading}
                    style={{
                      padding: '8px 16px',
                      background: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? '#f3f4f6' : 'var(--accent-primary)',
                      color: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? '#999' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 'not-allowed' : 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Вперед →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}