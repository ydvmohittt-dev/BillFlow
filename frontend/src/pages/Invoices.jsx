import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  FileText,
} from "../components/Icons";
export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    clientId: "",
    from: "",
    to: "",
    q: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    //crete empty query object .....RURLSearchParams() is a javascript API to handle queries
    const qs = new URLSearchParams();
    if (filters.status) qs.set("status", filters.status);
    if (filters.clientId) qs.set("clientId", filters.clientId);
    if (filters.from) qs.set("from", filters.from);
    if (filters.to) qs.set("to", filters.to);
    api(`/invoices?${qs}`)
      .then((data)=>setInvoices(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    Promise.all([api("/clients"), api("/invoices")])
      .then(([c, i]) => {
        setClients(c);
        setInvoices(i);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const filtered = invoices.filter((i) =>
    `${i.invoiceNumber} ${i.client?.name}`
      .toLowerCase()
      .includes(filters.q.toLowerCase()),
  );
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">INVOICES</div>
          <h1>Invoice workspace</h1>
          <p>Create, track and manage every invoice in one place.</p>
        </div>
        <Link className="primary" to="/invoices/new">
          <Plus size={18} /> New invoice
        </Link>
      </div>
      <div className="filters">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search invoice or client…"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={filters.clientId}
          onChange={(e) =>
            setFilters({ ...filters, clientId: e.target.value })
          }>
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
        <button className="secondary" onClick={load}>
          <SlidersHorizontal size={16} /> Apply
        </button>
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <div className="loading-row">
          <div className="loader" />
          Loading invoices…
        </div>
      ) : filtered.length ? (
        <div className="section-card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Created</th>
                  <th>Due</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i._id}>
                    <td>
                      <Link className="invoice-link" to={`/invoices/${i._id}`}>
                        {i.invoiceNumber}
                      </Link>
                    </td>
                    <td>{i.client?.name}</td>
                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(i.dueDate).toLocaleDateString()}</td>
                    <td>${i.total.toFixed(2)}</td>
                    <td>
                      <StatusBadge status={i.status} />
                    </td>
                    <td>
                      <Link className="icon-btn" to={`/invoices/${i._id}`}>
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={22} />
          </div>
          <h3>No invoices found</h3>
          <p>Try adjusting your filters or create a new invoice.</p>
          <Link className="secondary" to="/invoices/new">
            <Plus size={16} /> New invoice
          </Link>
        </div>
      )}
    </div>
  );
}
