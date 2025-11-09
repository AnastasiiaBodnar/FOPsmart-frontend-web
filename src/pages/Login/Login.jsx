import { useState, useMemo } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️

  const errors = useMemo(() => {
    const e = {};
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Невалідний email";
    }
    if (form.password && form.password.length < 8) {
      e.password = "Мінімум 8 символів";
    }
    return e;
  }, [form]);

  const isValid =
    form.email && form.password.length >= 8 && Object.keys(errors).length === 0;

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Помилка входу");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setApiError(error.message || "Невірний email або пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login">
      <h1 className="login__brand">FOPSmart</h1>

      <form className="login__card" onSubmit={onSubmit} noValidate>
        <div className="login__head">
          <h2>Вхід</h2>
          <Link to="/register" className="login__link">
            Немає акаунту? Зареєструйтеся
          </Link>
        </div>

        {apiError && (
          <div className="api-error">{apiError}</div>
        )}

        <label className="field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!errors.email}
            disabled={isLoading}
          />
          {touched.email && errors.email && (
            <span className="field__error">{errors.email}</span>
          )}
        </label>

        <label className="field password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!errors.password}
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Показати пароль"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.17-6.88"/><path d="M1 1l22 22"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
            )}
          </button>
          {touched.password && errors.password && (
            <span className="field__error">{errors.password}</span>
          )}
        </label>
        <button className="login__btn" disabled={!isValid || isLoading}>
          {isLoading ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </section>
  );
}