import React, { useState } from 'react';
import AppShell from "../../components/AppShell/AppShell";
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: 'Іван',
    lastName: 'Іванов',
    email: 'ivan.fop@gmail.com',
    password: '••••••••',
    userGroup: '3 група'
  });

  const [showPassword, setShowPassword] = useState(false);

  const [connectedBanks] = useState([
    { name: 'Monobank', status: 'connected' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    alert('Зміни збережено!');
  };

  const handleCancel = () => {
    console.log('Changes cancelled');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAddBank = () => {
    console.log('Adding new bank');
  };

  return (
    <AppShell title="Профіль">
      <div className="profile-content">
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
                name="userGroup"
                value={formData.userGroup}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="1 група">1 група</option>
                <option value="2 група">2 група</option>
                <option value="3 група">3 група</option>
                <option value="4 група">4 група</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="password">Пароль</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="banks-section">
          <div className="banks-header">
            <h2>Банки</h2>
          </div>

          <div className="banks-list">
            {connectedBanks.map((bank, index) => (
              <div key={index} className="bank-item">
                <div className="bank-info">
                  <span className="bank-name">{bank.name}</span>
                  <span className="bank-status connected">Підключено</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button className="btn-cancel" onClick={handleCancel}>
            Скасувати
          </button>
          <button className="btn-save" onClick={handleSaveChanges}>
            Зберегти зміни
          </button>
        </div>
      </div>
    </AppShell>
  );
};

export default Profile;