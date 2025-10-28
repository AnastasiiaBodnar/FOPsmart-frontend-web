import logo from "../../../assets/logo.png";
import './Header.css';

export  default function Header(){
    return (
         <header className="header">
        <div>
           <div>
            <img src={logo} alt="FOPSmart" />
            <span className="logoText">FOPSmart</span>
            </div> 

            <nav>
                <a href="#home">Головна</a>
                <a href="#how">Як це працює?</a>
                <a href="#features">Можливості</a>
                <button className="btnLogin">Вхід</button>
                <button className="btnRegistr">Реєтрація</button>
            </nav>
        </div>
        </header>
    )
}