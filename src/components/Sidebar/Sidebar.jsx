import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span>FOPSmart</span>
      </div>

      <nav className="sidebar__nav">
        
        <NavLink to="/dashboard" className="item">
          <span>Дашборд</span>
        </NavLink>

        <NavLink to="/transactions" className="item">
          <span>Транзакції</span>
        </NavLink>

        <NavLink to="/analytics" className="item">
          <span>Аналітика</span>
        </NavLink>

        <NavLink to="/chat" className="item">
          <span>AI-чат</span>
        </NavLink>

        <NavLink to="/settings" className="item">
          <span>Профіль</span>
        </NavLink>
      </nav>


      <span className="sidebar__version">v1.0 • {new Date().toISOString().slice(0,10)}</span>
    </aside>
  );
}
