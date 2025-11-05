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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Помилка входу");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
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
          <Link to="/register" className="login__link">Немає акаунту? Зареєструйтеся</Link>
        </div>

        {apiError && (
          <div className="api-error" style={{
            background: "#fee",
            color: "#c00",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            borderLeft: "3px solid #c00"
          }}>
            {apiError}
          </div>
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

        <label className="field">
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!errors.password}
            disabled={isLoading}
          />
          {touched.password && errors.password && (
            <span className="field__error">{errors.password}</span>
          )}
        </label>

        <div className="login__actions">
          <a href="#" className="login__forgot">Забули пароль?</a>
        </div>

        <button className="login__btn" disabled={!isValid || isLoading}>
          {isLoading ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </section>
  );
}