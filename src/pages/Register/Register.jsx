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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setApiError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          fopGroup: parseInt(form.fopGroup, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка реєстрації");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Щось пішло не так. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const EyeOpen = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOff = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.17-6.88"/>
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
      <path d="M1 1l22 22"/>
    </svg>
  );

  return (
    <section className="register">
      <h1 className="register__brand">FOPSmart</h1>

      <form className="register__card" onSubmit={onSubmit} noValidate>
        <div className="register__head">
          <h2>Реєстрація</h2>
          <Link to="/login" className="register__link">Є акаунт? Увійти</Link>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <div className="row-2">
          <label className="field">
            <input
              type="text"
              name="lastName"
              placeholder="Прізвище"
              value={form.lastName}
              onChange={onChange}
              onBlur={onBlur}
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
            disabled={isLoading}
          />
          {touched.email && errors.email && (
            <span className="field__error">{errors.email}</span>
          )}
        </label>

        {/* Пароль */}
        <label className="field password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
          >
            {showPassword ? EyeOpen : EyeOff}
          </button>
          {touched.password && errors.password && (
            <span className="field__error">{errors.password}</span>
          )}
        </label>

        {/* Підтвердження пароля */}
        <label className="field password-field">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirm"
            placeholder="Повторіть пароль"
            value={form.confirm}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Сховати пароль" : "Показати пароль"}
          >
            {showConfirm ? EyeOpen : EyeOff}
          </button>
          {touched.confirm && errors.confirm && (
            <span className="field__error">{errors.confirm}</span>
          )}
        </label>

        <button className="register__btn" disabled={!isValid || isLoading}>
          {isLoading ? "Реєстрація..." : "Продовжити"}
        </button>
      </form>
    </section>
  );
}
