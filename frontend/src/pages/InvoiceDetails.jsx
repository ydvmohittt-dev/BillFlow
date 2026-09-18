import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Send,
  Receipt,
} from "../components/Icons";

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/invoices/${id}`)
      .then(setInvoice)
      .catch((e) => setError(e.message));
  }, [id]);

  const changeStatus = async (status) => {
    setBusy(true);
    try {
      const updated = await api(`/invoices/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setInvoice(updated);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="page">
        <div className="alert error">{error}</div>
        <Link className="back-link" to="/invoices">
          <ArrowLeft size={16} /> Back to invoices
        </Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="screen-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="page invoice-page">
      <div className="invoice-toolbar">
        <Link className="back-link" to="/invoices">
          <ArrowLeft size={16} /> Back to invoices
        </Link>
        <div className="toolbar-actions">
          <button className="secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
          {invoice.status !== "paid" && (
            <button
              className="primary"
              disabled={busy}
              onClick={() => changeStatus("paid")}
            >
              <CheckCircle2 size={16} /> Mark paid
            </button>
          )}
        </div>
      </div>

      <div className="invoice-layout">
        <div className="print-invoice">
          <div className="invoice-header">
            <div>
              <div className="invoice-brand">
                <div className="brand-mark">B</div>
                <strong>BillFlow</strong>
              </div>
              <p>Professional invoicing for modern teams.</p>
            </div>
            <div className="invoice-title">
              <span>INVOICE</span>
              <strong>{invoice.invoiceNumber}</strong>
            </div>
          </div>

          <div className="invoice-meta">
            <div>
              <span>Bill to</span>
              <strong>{invoice.client?.name}</strong>
              <p>
                {invoice.client?.email}
                <br />
                {invoice.client?.phone}
                <br />
                {invoice.client?.billingAddress}
              </p>
            </div>
            <div className="meta-right">
              <div>
                <span>Issue date</span>
                <strong>{new Date(invoice.createdAt).toLocaleDateString()}</strong>
              </div>
              <div>
                <span>Due date</span>
                <strong>{new Date(invoice.dueDate).toLocaleDateString()}</strong>
              </div>
              <StatusBadge status={invoice.status} />
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.unitPrice).toFixed(2)}</td>
                  <td>${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-bottom">
            <div className="invoice-note">
              <span>Payment status</span>
              <strong>{invoice.status === "paid" ? "Payment received" : "Payment pending"}</strong>
              <p>
                Thank you for your business. Please reference {invoice.invoiceNumber} with your payment.
              </p>
            </div>
            <div className="invoice-totals">
              <div>
                <span>Subtotal</span>
                <strong>${invoice.subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Tax ({invoice.taxPercent}%)</span>
                <strong>${invoice.taxAmount.toFixed(2)}</strong>
              </div>
              <div className="grand">
                <span>Total</span>
                <strong>${invoice.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="invoice-footer">BillFlow · Modern invoicing workspace</div>
        </div>

        <aside className="invoice-side">
          <div className="side-card">
            <div className="side-icon">
              <Receipt size={19} />
            </div>
            <h3>Invoice status</h3>
            <StatusBadge status={invoice.status} />
            <p>Update the status as the invoice moves through your workflow.</p>
            <div className="status-actions">
              <button disabled={busy} onClick={() => changeStatus("draft")}>Draft</button>
              <button disabled={busy} onClick={() => changeStatus("sent")}>
                <Send size={14} /> Sent
              </button>
              <button disabled={busy} onClick={() => changeStatus("paid")}>
                <CheckCircle2 size={14} /> Paid
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
