import { API_URL, getAuthHeader } from "../config/api";

class ProfileService {
  async getProfile() {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося завантажити профіль');
    }

    return response.json();
  }

  async updateProfile(data) {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося оновити профіль');
    }

    return response.json();
  }

  async updateFopSettings(fopGroup) {
    const response = await fetch(`${API_URL}/api/profile/fop`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ fopGroup: parseInt(fopGroup) })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося оновити налаштування ФОП');
    }

    return response.json();
  }

  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${API_URL}/api/profile/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося змінити пароль');
    }

    return response.json();
  }

  async deleteAccount(password) {
    const response = await fetch(`${API_URL}/api/profile/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        password,
        confirmation: 'DELETE_MY_ACCOUNT'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не вдалося видалити акаунт');
    }

    return response.json();
  }
}

export default new ProfileService();