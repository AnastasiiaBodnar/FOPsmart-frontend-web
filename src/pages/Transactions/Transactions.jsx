import { useState, useEffect } from 'react';
import './Transactions.css';
import AppShell from '../../components/AppShell/AppShell';
import ManualTransactionModal from '../../components/ManualTransactionModal/ManualTransactionModal';

const API_URL = 'https://fopsmart-4030403a47a5.herokuapp.com/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([
    { value: 'all', label: ' Всі категорії' }
  ]);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    type: 'all', 
    mcc: null 
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [filters, pagination.page, pagination.limit]);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/transactions/mcc-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const mccCategories = data.categories.map(cat => ({
          value: cat.mcc,
          label: `${cat.nameUk}`,
          parentCategory: cat.parentCategory
        }));
        
        setCategories([
          { value: 'all', label: ' Всі категорії' },
          ...mccCategories
        ]);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Потрібна авторизація');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();

      params.append('limit', pagination.limit);
      params.append('offset', (pagination.page - 1) * pagination.limit);

      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.mcc && filters.mcc !== 'all') params.append('mcc', filters.mcc);

      params.append('fopOnly', 'true');

      const response = await fetch(`${API_URL}/transactions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Не вдалося завантажити транзакції');
      }

      const data = await response.json();
      
      setTransactions(data.transactions || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0
      }));

    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err.message || 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionCreated = () => {
    loadTransactions();
  };

  const formatCurrency = (amount) => {
    const amountInUAH = Math.abs(amount) / 100;
    return new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amountInUAH) + ' грн';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTypeClass = (amount) => {
    return amount > 0 ? 'income' : 'expense';
  };

  const getStatusBadge = (hold) => {
    if (hold) {
      return <span className="status-badge hold"> Утримання</span>;
    }
    return <span className="status-badge completed"> Завершено</span>;
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); 
  };

  const handleExport = () => {
    alert('Експорт у розробці! Скоро буде доступна функція завантаження CSV/Excel');
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <AppShell title="Транзакції">
        <div className="filters-bar">
          <div className="filter-group">
            <label> Пошук</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Назва або контрагент..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label> Категорія</label>
            <select
              className="filter-select"
              value={filters.mcc === null ? 'all' : filters.mcc.toString()}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('mcc', value === 'all' ? null : parseInt(value));
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label> Тип</label>
            <select
              className="filter-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">Всі</option>
              <option value="income">Доходи</option>
              <option value="expense">Витрати</option>
            </select>
          </div>

          <div className="filter-group">
            <label> Від</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label> До</label>
            <input
              type="date"
              className="filter-input"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              className="btn-add-transaction"
              onClick={() => setIsModalOpen(true)}
              title="Додати транзакцію вручну"
            >
              ➕ Додати
            </button>
          </div>
        </div>

        <div className="transactions-table-wrapper">
          {error ? (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <h3>Помилка завантаження</h3>
              <p>{error}</p>
              <button 
                className="btn-retry" 
                onClick={() => window.location.reload()}
              >
                Спробувати ще раз
              </button>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Завантаження транзакцій...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Транзакцій не знайдено</h3>
              <p>Спробуйте змінити параметри фільтрації</p>
            </div>
          ) : (
            <>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Опис</th>
                    <th>Категорія</th>
                    <th>Сума</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th>Рахунок</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="transaction-row">
                      <td className="date-cell">{formatDate(transaction.date)}</td>
                      <td className="description-cell">{transaction.description}</td>
                      <td className="category-cell">
                        <span className="category-badge" style={{ backgroundColor: transaction.color || '#e0e0e0' }}>
                          {transaction.category || 'Без категорії'}
                        </span>
                      </td>
                      <td className={`amount-cell ${getTypeClass(transaction.amount)}`}>
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
                        {transaction.account?.isFop ? '🏦 ФОП' : '👤 Особистий'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination.total > pagination.limit && (
                <div className="pagination-wrapper">
                  <button
                    className="pagination-btn"
                    onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                    disabled={pagination.page === 1 || loading}
                    title="Перша сторінка"
                  >
                    ⟪
                  </button>

                  <button
                    className="pagination-btn"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1 || loading}
                    title="Попередня сторінка"
                  >
                    ←
                  </button>

                  <span className="pagination-info">
                    Сторінка {pagination.page} з {totalPages}
                    <span className="pagination-count">
                      ({pagination.total} {pagination.total === 1 ? 'транзакція' : pagination.total < 5 ? 'транзакції' : 'транзакцій'})
                    </span>
                  </span>

                  <button
                    className="pagination-btn"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= totalPages || loading}
                    title="Наступна сторінка"
                  >
                    →
                  </button>

                  <button
                    className="pagination-btn"
                    onClick={() => setPagination(prev => ({ ...prev, page: totalPages }))}
                    disabled={pagination.page >= totalPages || loading}
                    title="Остання сторінка"
                  >
                    ⟫
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <ManualTransactionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTransactionCreated}
        />
    </AppShell>
  );
}