import { useState, useMemo } from "react";
import "./Register.css";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    fopGroup: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Вкажіть ім’я";
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

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    console.log("register payload:", form);
    alert("Форма валідна (далі підключимо бекенд).");
  };

  return (
    <section className="register">
      <h1 className="register__brand">FOPSmart</h1>

      <form className="register__card" onSubmit={onSubmit} noValidate>
        <div className="register__head">
          <h2>Реєстрація</h2>
          <Link to="/login" className="register__link">Є акаунт? Увійти</Link>
        </div>

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
            />
            {touched.lastName && errors.lastName && (
              <span className="field__error">{errors.lastName}</span>
            )}
          </label>


          <label className="field">
            <input
              type="text"
              name="firstName"
              placeholder="Ім’я"
              value={form.firstName}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={!!errors.firstName}
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
          >
            <option value="">Група ФОП</option>
            <option value="I">I група</option>
            <option value="II">II група</option>
            <option value="III">III група</option>
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

        <label className="field">
          <input
            type="password"
            name="confirm"
            placeholder="Повторіть пароль"
            value={form.confirm}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!errors.confirm}
          />
          {touched.confirm && errors.confirm && (
            <span className="field__error">{errors.confirm}</span>
          )}
        </label>

        <button className="register__btn" disabled={!isValid}>
          Продовжити
        </button>
      </form>
    </section>
  );
}
