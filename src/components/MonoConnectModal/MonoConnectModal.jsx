import { useState } from "react";
import "./MonoConnectModal.css";
import monobankService from "../../services/monobankService";

export default function MonoConnectModal({ onConnected }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Будь ласка, введіть токен");
      return;
    }

    setLoading(true);
    try {
      const result = await monobankService.connect(token);
      
      console.log("Monobank connected:", result);
      
      localStorage.setItem("mono_token", token);
      localStorage.setItem("mono_connected", "true");

      if (result.fopAccounts && result.fopAccounts.length > 0) {
        setSyncing(true);
        try {
          await monobankService.sync();
          console.log("Transactions synced");
        } catch (syncError) {
          console.warn("Sync warning:", syncError);
        }
        setSyncing(false);
      }

      onConnected?.();
    } catch (err) {
      console.error("Monobank connect error:", err);
      setError(err.message || "Не вдалося підключити. Перевірте токен.");
    } finally {
      setLoading(false);
      setSyncing(false);
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
              placeholder="Ваш токен Monobank"
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
              autoFocus
              disabled={loading || syncing}
            />

            {error && <div className="mono-error">{error}</div>}

            <div className="mono-actions">
              <button 
                type="submit" 
                className="mono-btn mono-btn--primary" 
                disabled={loading || syncing || !token.trim()}
              >
                {syncing ? "Синхронізація..." : loading ? "Підключаю..." : "Підключити"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}