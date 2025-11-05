import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MonoConnectModal from "../MonoConnectModal/MonoConnectModal";
import "./AppShell.css";
import monobankService from "../../services/monobankService";

export default function AppShell({ title, actions = null, children }) {
  const [hasMono, setHasMono] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkMonoStatus = async () => {
    try {
      const status = await monobankService.getStatus();
      setHasMono(status.connected);
    } catch (error) {
      console.error("Monobank status check error:", error);
      setHasMono(false);
    } finally {
      setChecked(true);
    }
  };

  useEffect(() => {
    checkMonoStatus();
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
          <h1>{title || "Dashboard"}</h1>
          {actions && <div className="actions">{actions}</div>}
        </header>

        <div className="content">{children}</div>
      </main>

      {gated && <MonoConnectModal onConnected={onConnected} />}
    </div>
  );
}