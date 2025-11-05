import { useState } from "react";
import "./MonoConnectModal.css";

export default function MonoConnectModal({ onConnected }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");


    setLoading(true);
    try {
      // тимчасово — зберігаємо локально, щоб модалка не з’являлась знову
      localStorage.setItem("mono_token", token);

      onConnected?.();
    } catch (e) {
      setError("Не вдалося підключити. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

return (
  <>
    <div className="mono-backdrop" />
    <div className="mono-modal" role="dialog" aria-modal="true" aria-labelledby="mono-title">
      <div className="mono-card">
        <h2 id="mono-title">Підключення Monobank</h2>
        <p className="mono-sub">
          Введіть ваш персональний токен Monobank, щоб підключити рахунок
        </p>

        <form onSubmit={submit} className="mono-form">
          <input
            className="mono-input"
            placeholder="skk_*******"
            value={token}
            onChange={(e) => setToken(e.target.value.trim())}
            autoFocus
          />

          {error && <div className="mono-error">{error}</div>}

          <div className="mono-actions">
            <button type="submit" className="mono-btn mono-btn--primary" disabled={loading}>
              {loading ? "Підключаю..." : "Підключити"}
            </button>
            <button type="button" className="mono-btn">Скасувати</button>
          </div>
        </form>
      </div>
    </div>
  </>
);

}
