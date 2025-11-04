import { useState, useMemo } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});

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

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    console.log("login payload:", form);
    alert("Логін успішний (поки без бекенда)");
  };

  return (
    <section className="login">
      <h1 className="login__brand">FOPSmart</h1>

      <form className="login__card" onSubmit={onSubmit} noValidate>
        <div className="login__head">
          <h2>Вхід</h2>
          <Link to="/register" className="login__link">Немає акаунту? Зареєструйтеся</Link>
        </div>

        <label className="field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!errors.email}
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
          />
          {touched.password && errors.password && (
            <span className="field__error">{errors.password}</span>
          )}
        </label>

        <div className="login__actions">
          <a href="#" className="login__forgot">Забули пароль?</a>
        </div>

        <button className="login__btn" disabled={!isValid}>
          Увійти
        </button>
      </form>
    </section>
  );
}