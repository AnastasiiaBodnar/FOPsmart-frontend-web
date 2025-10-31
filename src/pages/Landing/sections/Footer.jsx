import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <a href="/" className="footer__col footer__logo-link">
          <h3 className="footer__logo">FOPSmart</h3>
          <p>ФОП без стресу —<br />податки під контролем</p>
        </a>

        <div className="footer__col footer__menu">
          <h3>Меню:</h3>
          <ul>
            <li><a href="#home">Головна</a></li>
            <li><a href="#how">Як це працює?</a></li>
            <li><a href="#features">Можливості</a></li>
          </ul>
        </div>

        <div className="footer__col footer__contacts">
          <h3>Контакти:</h3>
          <a href="mailto:fopsmart@gmail.com">fopsmart@gmail.com</a><br />
          <a href="tel:+38097171928">+380 97 17 1928</a>
        </div>
      </div>

      <hr />
      <p className="footer__copy">© 2025 FOPSmart. Усі права захищені.</p>
    </footer>
  );
}
