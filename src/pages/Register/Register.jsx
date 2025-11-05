import { useState, useMemo } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    fopGroup: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Вкажіть ім'я";
    if (!form.lastName.trim()) e.lastName = "Вкажіть прізвище";
    if (!form.fopGroup) e.fopGroup = "Оберіть групу ФОП";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Невалідний email";
    if (form.password && form.password.length < 8)
      e.password = "Мінімум 8 символів";
    if (form.confirm && form.confirm !== form.password)
      e.confirm = "Паролі не співпадають";
    return e;
  }, [form]);

  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.fopGroup &&
    form.email &&
    form.password.length >= 8 &&
    form.confirm === form.password &&
    Object.keys(errors).length === 0;

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
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          fopGroup: parseInt(form.fopGroup),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Помилка реєстрації");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

    } catch (error) {
      console.error("Registration error:", error);
      setApiError(error.message || "Щось пішло не так. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register">
      <h1 className="register__brand">FOPSmart</h1>

      <form className="register__card" onSubmit={onSubmit} noValidate>
        <div className="register__head">
          <h2>Реєстрація</h2>
          <Link to="/login" className="register__link">Є акаунт? Увійти</Link>
        </div>

        {apiError && (
          <div className="api-error">
            {apiError}
          </div>
        )}

        <div className="row-2">
          <label className="field">
            <input
              type="text"
              name="lastName"
              placeholder="Прізвище"
              value={form.lastName}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={!!errors.lastName}
              disabled={isLoading}
            />
            {touched.lastName && errors.lastName && (
              <span className="field__error">{errors.lastName}</span>
            )}
          </label>

          <label className="field">
            <input
              type="text"
              name="firstName"
              placeholder="Ім'я"
              value={form.firstName}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={!!errors.firstName}
              disabled={isLoading}
            />
            {touched.firstName && errors.firstName && (
              <span className="field__error">{errors.firstName}</span>
            )}
          </label>
        </div>

        <label className="field">
          <select
            name="fopGroup"
            value={form.fopGroup}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!errors.fopGroup}
            disabled={isLoading}
          >
            <option value="">Група ФОП</option>
            <option value="1">I група (до 505 676 грн/рік)</option>
            <option value="2">II група (до 3 028 000 грн/рік)</option>
            <option value="3">III група (до 7 000 000 грн/рік)</option>
          </select>
          {touched.fopGroup && errors.fopGroup && (
            <span className="field__error">{errors.fopGroup}</span>
          )}
        </label>

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

        <label className="field">
          <input
            type="password"
            name="confirm"
            placeholder="Повторіть пароль"
            value={form.confirm}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!errors.confirm}
            disabled={isLoading}
          />
          {touched.confirm && errors.confirm && (
            <span className="field__error">{errors.confirm}</span>
          )}
        </label>

        <button 
          className="register__btn" 
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Реєстрація..." : "Продовжити"}
        </button>
      </form>
    </section>
  );
}