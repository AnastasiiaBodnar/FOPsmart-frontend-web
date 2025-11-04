import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";
import { authAPI, ApiError } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Невалідний email";
    }
    if (form.password && form.password.length < 6) {
      e.password = "Мінімум 6 символів";
    }
    return e;
  }, [form]);

  const isValid =
    form.email && form.password.length >= 6 && Object.keys(errors).length === 0;

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setServerError("");
  };

  const onBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setServerError("");

    try {
      const response = await authAPI.login(form.email, form.password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (response.fopLimit) {
        localStorage.setItem('fopLimit', JSON.stringify(response.fopLimit));
      }

      navigate('/dashboard');
      
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setServerError("Невірний email або пароль");
        } else if (error.status === 0) {
          setServerError("Помилка з'єднання з сервером");
        } else {
          setServerError(error.message || "Виникла помилка при вході");
        }
      } else {
        setServerError("Несподівана помилка. Спробуйте ще раз");
      }
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

        {serverError && (
          <div className="login__error">
            {serverError}
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
          {isLoading ? "Завантаження..." : "Увійти"}
        </button>
      </form>
    </section>
  );
}