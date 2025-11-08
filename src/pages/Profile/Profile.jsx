import { useState, useEffect } from "react";
import AppShell from "../../components/AppShell/AppShell";
import profileService from "../../services/profileService";
import monobankService from "../../services/monobankService";
import "./Profile.css";

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    fopGroup: 1
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [connectedBanks, setConnectedBanks] = useState([]);

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await profileService.getProfile();
      
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        fopGroup: data.fopGroup || 1
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMonobankStatus = async () => {
    try {
      const status = await monobankService.getStatus();
      
      if (status.connected) {
        setConnectedBanks([
          {
            name: 'Monobank',
            status: 'connected',
            clientName: status.connection?.clientName
          }
        ]);
      }
    } catch (err) {
      console.error('Error loading monobank status:', err);
    }
  };

  useEffect(() => {
    loadProfileData();
    loadMonobankStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      await profileService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });

      await profileService.updateFopSettings(formData.fopGroup);

      setSuccessMessage('Зміни успішно збережено!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfileData();
    setError(null);
    setSuccessMessage('');
  };

  const handleAddBank = () => {
    console.log('Adding new bank');
  };

  if (loading) {
    return (
      <AppShell title="Профіль">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "var(--dark-grey)" }}>
            Завантаження даних...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error && !formData.email) {
    return (
      <AppShell title="Профіль">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#e11d48", marginBottom: "16px" }}>
            Помилка: {error}
          </p>
          <button 
            onClick={() => loadProfileData()}
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
    <AppShell title="Профіль">
      <div className="profile-content">
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        <section className="personal-info-section">
          <h2>Особисті дані</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">Ім'я</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Прізвище</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="userGroup">Група оподаткування</label>
              <select
                id="userGroup"
                name="fopGroup"
                value={formData.fopGroup}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value={1}>1 група</option>
                <option value={2}>2 група</option>
                <option value={3}>3 група</option>
              </select>
            </div>
          </div>
        </section>

        <section className="banks-section">
          <div className="banks-header">
            <h2>Банки</h2>
          </div>

          <div className="banks-list">
            {connectedBanks.length === 0 ? (
              <div className="empty-state">
                <p>Банки ще не підключені</p>
              </div>
            ) : (
              connectedBanks.map((bank, index) => (
                <div key={index} className="bank-item">
                  <div className="bank-info">
                    <span className="bank-name">{bank.name}</span>
                    <span className="bank-status connected">Підключено</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="form-actions">
          <button className="btn-cancel" onClick={handleCancel} disabled={saving}>
            Скасувати
          </button>
          <button className="btn-save" onClick={handleSaveChanges} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}