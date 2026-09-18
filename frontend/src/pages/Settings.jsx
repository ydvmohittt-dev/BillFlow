import { getUser } from "../api";

export default function Settings() {
  const user = getUser();

  return (
    <div className="page narrow">
      <div className="eyebrow">SETTINGS</div>
      <h1>Account settings</h1>
      <p className="page-subtitle">View your BillFlow account details.</p>

      <section className="section-card settings-card">
        <div className="settings-head">
          <div className="avatar large">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
