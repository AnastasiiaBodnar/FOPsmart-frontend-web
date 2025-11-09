import { API_URL, getAuthHeader } from "../config/api";

const transactionsService = {
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.mcc) params.append('mcc', filters.mcc);
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.excludeHolds) params.append('excludeHolds', 'true');
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    if (filters.fopOnly !== undefined) params.append('fopOnly', filters.fopOnly);

    const response = await fetch(
      `${API_URL}/api/transactions?${params}`,
      {
        headers: getAuthHeader()
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося завантажити транзакції');
    }

    return response.json();
  },

  async getStats(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.fopOnly !== undefined) params.append('fopOnly', filters.fopOnly);

    const response = await fetch(
      `${API_URL}/api/transactions/stats?${params}`,
      {
        headers: getAuthHeader()
      }
    );

    if (!response.ok) {
      throw new Error('Не вдалося завантажити статистику');
    }

    return response.json();
  },

  async getByCategory(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.fopOnly !== undefined) params.append('fopOnly', filters.fopOnly);

    const response = await fetch(
      `${API_URL}/api/transactions/by-category?${params}`,
      {
        headers: getAuthHeader()
      }
    );

    if (!response.ok) {
      throw new Error('Не вдалося завантажити категорії');
    }

    return response.json();
  },

  async getMccCategories() {
    const response = await fetch(
      `${API_URL}/api/transactions/mcc-categories`,
      {
        headers: getAuthHeader()
      }
    );

    if (!response.ok) {
      throw new Error('Не вдалося завантажити категорії MCC');
    }

    return response.json();
  },

  async getFopAccounts() {
    const response = await fetch(
      `${API_URL}/api/transactions/fop-accounts`,
      {
        headers: getAuthHeader()
      }
    );

    if (!response.ok) {
      throw new Error('Не вдалося завантажити рахунки');
    }

    return response.json();
  },

  async createManual(data) {
    const response = await fetch(
      `${API_URL}/api/transactions/manual`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося створити транзакцію');
    }

    return response.json();
  },

  async updateManual(id, data) {
    const response = await fetch(
      `${API_URL}/api/transactions/manual/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося оновити транзакцію');
    }

    return response.json();
  },

  async deleteManual(id) {
    const response = await fetch(
      `${API_URL}/api/transactions/manual/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeader()
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося видалити транзакцію');
    }

    return response.json();
  },

  async exportToCsv(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);

    console.log('Export functionality will be implemented');

  
  }
};

export default transactionsService;