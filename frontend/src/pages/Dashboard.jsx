import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getUser } from "../api";
import StatusBadge from "../components/StatusBadge";
import {
  Plus,
  FileText,
  Users,
  DollarSign,
  ArrowLeft,
} from "../components/Icons";
export default function Dashboard() {
  const user = getUser();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api("/invoices"), api("/clients")])
      .then(([i, c]) => {
        setInvoices(i);
        setClients(c);
      })
      .finally(() => setLoading(false));
  }, []);
  const paid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.total, 0);
  const outstanding = invoices
    .filter((i) => ["sent", "overdue"].includes(i.status))
    .reduce((s, i) => s + i.total, 0);
  const recent = invoices.slice(0, 5);
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Good to see you, {user?.name?.split(" ")[0]}.</h1>
          <p>Here is what is happening across your invoicing workspace.</p>
        </div>
        <Link className="primary" to="/invoices/new">
          <Plus size={18} /> New invoice
        </Link>
      </div>
      <div className="stat-grid">
        <Stat icon={FileText} label="Total invoices" value={invoices.length} />
        <Stat icon={Users} label="Active clients" value={clients.length} />
        <Stat
          icon={DollarSign}
          label="Paid revenue"
          value={`$${paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        />
        <Stat
          icon={DollarSign}
          label="Outstanding"
          value={`$${outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        />
      </div>
      <section className="section-card">
        <div className="section-head">
          <div>
            <h2>Recent invoices</h2>
            <p>Your latest invoice activity.</p>
          </div>
          <Link to="/invoices" className="text-link">
            View all <ArrowLeft size={15} />
          </Link>
        </div>
        {loading ? (
          <div className="loading-row">
            <div className="loader" />
            Loading invoices…
          </div>
        ) : recent.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Due date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((i) => (
                  <tr key={i._id}>
                    <td>
                      <Link className="invoice-link" to={`/invoices/${i._id}`}>
                        {i.invoiceNumber}
                      </Link>
                    </td>
                    <td>{i.client?.name}</td>
                    <td>{new Date(i.dueDate).toLocaleDateString()}</td>
                    <td>${i.total.toFixed(2)}</td>
                    <td>
                      <StatusBadge status={i.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-inline">
            No invoices yet.{" "}
            <Link to="/invoices/new">Create your first invoice.</Link>
          </div>
        )}
      </section>
    </div>
  );
}
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={19} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
