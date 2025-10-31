import logo from "../../../assets/logo.png";
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          <img src={logo} alt="FOPSmart" />
          <span className="logoText">FOPSmart</span>
        </a>

        <nav className="header__nav">
          <a href="#home">Головна</a>
          <a href="#how">Як це працює?</a>
          <a href="#features">Можливості</a>
        </nav>

        <div className="header__buttons">
          <Link to="/login" className="btnLogin">Вхід</Link>
          <Link to="/register" className="btnRegistr">Реєстрація</Link>
        </div>
      </div>
    </header>
  );
}