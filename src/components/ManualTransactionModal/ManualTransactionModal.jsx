import { useState, useEffect } from 'react';
import './ManualTransactionModal.css';

export default function ManualTransactionModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
    type: 'income',
    mcc: '',
    comment: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fopsmart-4030403a47a5.herokuapp.com/api/transactions/mcc-categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        transactionDate: formData.transactionDate,
        type: formData.type,
        mcc: formData.mcc ? parseInt(formData.mcc) : undefined,
        comment: formData.comment || undefined
      };

      const response = await fetch('https://fopsmart-4030403a47a5.herokuapp.com/api/transactions/manual', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не вдалося створити транзакцію');
      }

      const data = await response.json();
      console.log('Transaction created:', data);

      onSuccess?.();
      onClose();
      
      setFormData({
        amount: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
        type: 'income',
        mcc: '',
        comment: ''
      });

    } catch (err) {
      console.error('Create transaction error:', err);
      setError(err.message || 'Помилка створення транзакції');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Додати транзакцію вручну</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          {error && (
            <div className="form-error">
              ⚠️ {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Тип транзакції *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="form-select"
                required
              >
                <option value="income"> Дохід</option>
                <option value="expense"> Витрата</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Сума (грн) *</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="form-input"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Опис *</label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="form-input"
              placeholder="Опис транзакції"
              maxLength={500}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="transactionDate">Дата *</label>
              <input
                id="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => handleChange('transactionDate', e.target.value)}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mcc">Категорія</label>
              <select
                id="mcc"
                value={formData.mcc}
                onChange={(e) => handleChange('mcc', e.target.value)}
                className="form-select"
              >
                <option value="">Без категорії</option>
                {categories.map(cat => (
                  <option key={cat.mcc} value={cat.mcc}>
                    {cat.nameUk}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Коментар</label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              className="form-textarea"
              placeholder="Додатковий коментар (опціонально)"
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Створення...' : 'Створити транзакцію'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}