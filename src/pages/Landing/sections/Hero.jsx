import "./Hero.css";
import chat from "../../../assets/chat.png";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__container">

        <div className="hero__phone">
          <div className="phone">
            <div className="phone__screen">
              <img src={chat} alt="FOPSmart Chat preview" />
            </div>
          </div>
        </div>

        <div className="hero__content">
          <h1>ФОП без стресу — все під контролем</h1>
          <p>
            FOPSmart з ФОПіком імпортує твої транзакції, рахує ліміти і допомагає згенерувати звіти в один клік.
          </p>
          <Link to="/register" className="hero__cta">Спробувати зараз</Link>
        </div>
      </div>
    </section>
  );
}
