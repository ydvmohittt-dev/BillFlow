import { getUser ,clearSession } from "../api";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const nav =useNavigate();
  const user = getUser();
const logout = () => {
    clearSession();
    nav("/login");
  };
  return (
    <div className="page narrow">
      <div className="eyebrow">SETTINGS</div>
      <h1>Account settings</h1>
      <p className="page-subtitle">View your BillFlow account details.</p>

      <section className="section-card settings-card">
        <div className="settings-head">
          <div className="avatar large">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="setting-div">
            <div className="Setting-detail"><h2>{user?.name}</h2>
            <p>{user?.email}</p>
            </div>
            
            <div className=" setting-logout"></div>
              <button className="logout-button" onClick={logout}>
            <LogOut size={12} /> Sign out
          </button>
          </div>
        </div>
      </section>
    </div>
  );
}
