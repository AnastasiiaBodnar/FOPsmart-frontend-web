import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MonoConnectModal from "../MonoConnectModal/MonoConnectModal";
import "./AppShell.css";

export default function AppShell({ title, actions = null, children }) {
  const [hasMono, setHasMono] = useState(true);     
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const present = !!localStorage.getItem("mono_token"); // тимчасово, до бекенду
    setHasMono(present);
    setChecked(true);
  }, []);

  const onConnected = () => {
    setHasMono(true);
  };

  const gated = checked && !hasMono;

  return (
    <div className={`app ${gated ? "app--gated" : ""}`}>
      <Sidebar />

      <main className="main" aria-hidden={gated}>
        <header className="topbar">
          <h1>{title || "Текс"}</h1>
          {actions && <div className="actions">{actions}</div>}
        </header>

        <div className="content">{children}</div>
      </main>

      {gated && <MonoConnectModal onConnected={onConnected} />}
    </div>
  );
}
