import { useState, useEffect } from "react";
import logo from "../../../assets/logo.png";
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMenuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [isMenuOpen]);

  useEffect(() => {
    const setHeaderH = () => {
      const h = document.querySelector(".header")?.offsetHeight || 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setHeaderH();
    window.addEventListener("resize", setHeaderH);
    return () => window.removeEventListener("resize", setHeaderH);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="header">
      <div className="header__container">
        <a href="#home" className="header__logo" onClick={handleLogoClick}>
          <img src={logo} alt="FOPSmart" />
          <span className="logoText">FOPSmart</span>
        </a>

        <nav className="header__nav">
          <a href="#how">Як це працює?</a>
          <a href="#features">Можливості</a>
          <a href="#problem">Проблеми</a>
        </nav>

        <div className="header__buttons">
          <Link to="/login" className="btnLogin">Вхід</Link>
          <Link to="/register" className="btnRegistr">Реєстрація</Link>
        </div>

         <button
          className="header__burger"
          onClick={toggleMenu}
          aria-label="Меню"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <>
          <span></span>
          <span></span>
          <span></span>
          </>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`header__mobile-menu ${isMenuOpen ? "active" : ""}`}
        onClick={closeMenu}
      >
        <div
          className="header__mobile-content"
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="header__mobile-nav">
            <a href="#home" onClick={closeMenu}>Головна</a>
            <a href="#how" onClick={closeMenu}>Як це працює?</a>
            <a href="#features" onClick={closeMenu}>Можливості</a>
          </nav>

          <div className="header__mobile-buttons">
            <Link to="/login" className="btnLogin" onClick={closeMenu}>
              Вхід
            </Link>
            <Link to="/register" className="btnRegistr" onClick={closeMenu}>
              Реєстрація
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
