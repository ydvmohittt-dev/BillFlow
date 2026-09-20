import { getUser ,clearSession } from "../api";
import { Eye, LogOut } from "lucide-react";
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
           
            <div className="view-logout">
               <button className="view-button" onClick={()=>nav("/settings/user")} >
            <Eye size={15} /> View
          </button>
              <button className="logout-button" onClick={logout}>
            <LogOut size={15} /> Sign out
          </button>
            </div>
              
          
          </div>
        </div>
      </section>
    </div>
  );
}
