import React from "react";
import { useEffect, useState } from "react";
import { Link  } from "react-router-dom";
import { api } from "../api";
import { clearSession } from "../api";
import { ArrowLeft, Mail, Phone,LogOut,Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const User = () => {
    const nav=useNavigate();
    const logout = () => {
    clearSession();
    nav("/login");
  };
  const [user, setUser] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api("/auth/me"), api("/clients")])
      .then(([userData, clientsData]) => {
        setUser(userData.user);
        setClients(clientsData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  return (
    <div className="page narrow">
      <Link className="back-link" to="/settings">
        <ArrowLeft size={16} /> Back to settings
      </Link>

      <div className="eyebrow">PROFILE</div>
      <h1>Your profile</h1>
      <p className="page-subtitle">
        A quick overview of your account and clients.
      </p>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="loading-row">
          <div className="loader" />
          Loading profile…
        </div>
      ) : (
        <>
          <section className="section-card settings-card">
              <div className="settings-head">
          <div className="avatar large">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="setting-div">
            <div className="Setting-detail"><h2>{user?.name}</h2>
            <p>{user?.email}</p>
            </div>
           
            
             
              <button className="logout-button" onClick={logout}>
            <LogOut size={15} /> Sign out
          </button>
          
              
          
          </div>
        </div>
          </section>

          <section className="section-card">
            <div className="card-title">
              <h2>Your clients</h2>
              <span>
                {clients.length} client{clients.length !== 1 ? "s" : ""}
              </span>
            </div>

            {clients.length ? (
              <div className="client-grid">
                {clients.map((c) => (
                  <div className="client-card" key={c._id}>
                    <div className="client-card-head">
                      <div className="avatar large">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3>{c.name}</h3>
                        <span>{c.billingAddress}</span>
                        <br />
                        <span className="client-since">
                          Client since{" "}
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                             month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="client-contact">
                      <span>
                        <Mail size={15} />
                        {c.email}
                      </span>
                      <span>
                        <Phone size={15} />
                        {c.phone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Users size={22} />
                </div>
                <h3>No clients yet</h3>
                <p>Add a client before creating your first invoice.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default User;
