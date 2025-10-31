import "./Hero.css";
import chat from "../../../assets/chat.png";

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
          <a href="#features" className="hero__cta">Спробувати зараз</a>
        </div>
      </div>
    </section>
  );
}
