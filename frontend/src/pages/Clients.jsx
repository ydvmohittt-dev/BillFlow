import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import {
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from "../components/Icons";
export default function Clients() {
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    api("/clients")
     .then((data) => setClients(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const remove = async (id) => {
    if (!confirm("Delete this client and its invoices?")) return;
    try {
      await api(`/clients/${id}`, { method: "DELETE" });
      setClients((c) => c.filter((x) => x._id !== id));
    } catch (e) {
      setError(e.message);
    }
  };
  const shown = clients.filter((c) =>
    `${c.name} ${c.email} ${c.phone} ${c.billingAddress}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">CLIENTS</div>
          <h1>Client directory</h1>
          <p>Keep billing contacts organized and ready for invoicing.</p>
        </div>
        <Link className="primary" to="/clients/new">
          <Plus size={18} /> Add client
        </Link>
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search clients…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="result-count">
          {shown.length} client{shown.length !== 1&&shown.length !== 0? "s" : ""}
        </span>
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <div className="loading-row">
          <div className="loader" />
          Loading clients…
        </div>
      ) : shown.length ? (
        <div className="client-grid">
          {shown.map((c) => (
            <div className="client-card" key={c._id}>
              <div className="client-card-head">
                <div className="avatar large">{c.name[0].toUpperCase()}</div>
                <div>
                  <h3>{c.name}</h3>
                  <span>{c.billingAddress}</span>
                </div>
                <div className="row-actions">
                  <Link to={`/clients/${c._id}/edit`} className="icon-btn">
                    <Pencil size={16} />
                  </Link>
                  <button
                    className="icon-btn danger"
                    onClick={() => remove(c._id)}>
                    <Trash2 size={16} />
                  </button>
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
          <h3>{query ? "No matching clients" : "No clients yet"}</h3>
          <p>
            {query
              ? "Try a different search term."
              : "Add a client before creating your first invoice."}
          </p>
          {!query && (
            <Link className="secondary" to="/clients/new">
              <Plus size={16} /> Add client
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
