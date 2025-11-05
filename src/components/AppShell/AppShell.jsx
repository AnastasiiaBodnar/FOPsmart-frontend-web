import Sidebar from "../Sidebar/Sidebar";
import "./AppShell.css";

export default function AppShell({ title, actions, children }) {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <header className="topbar">
          <h1>{title || "Текс"}</h1>
          {actions && <div className="actions">{actions}</div>}
        </header>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}
