import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { api } from "../api";
import { ArrowLeft, Plus, Trash2, Save } from "../components/Icons";

const blankItem = { description: "", quantity: 1, unitPrice: 0 };

export default function InvoiceForm() {
  const nav = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      clientId: "",
      items: [{ ...blankItem }],
      taxPercent: 18,
      dueDate: "",
      status: "draft",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [clients, setClients] = useState([]);
  const items = useWatch({ control, name: "items" }) || [];
  const taxPercent = Number(useWatch({ control, name: "taxPercent" }) || 0);

  useEffect(() => {
    api("/clients")
      .then((clients) => {
        setClients(clients);
        if (clients[0]) setValue("clientId", clients[0]._id);
      })
      .catch((error) => setError("root", { message: error.message }));
  }, [setError, setValue]);


  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0,
  );
  const tax = (subtotal * taxPercent) / 100;
  const total = subtotal + tax;

  const onSubmit = async (data) => {
    const invoice = data;
    try {
      await api("/invoices", {
        method: "POST",
        body: JSON.stringify(invoice),
      });
      nav("/invoices");
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  return (
    <div className="page">
      <Link className="back-link" to="/invoices">
        <ArrowLeft size={16} /> Back to invoices
      </Link>
      <div className="page-head compact">
        <div>
          <div className="eyebrow">NEW INVOICE</div>
          <h1>Create invoice</h1>
          <p>Build a clear, itemized invoice for your client.</p>
        </div>
      </div>

      {errors.root && <div className="alert error">{errors.root.message}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="invoice-builder">
          <section className="section-card">
            <div className="card-title">
              <h2>Invoice details</h2>
              <span>Step 1</span>
            </div>
            <div className="form-grid">
              <label>
                Invoice number
                <input {...register("invoiceNumber", { required: "Invoice number is required" })} />
              </label>
              <label>
                Client
                <select {...register("clientId", { required: "Please select a client" })}>
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>{client.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Due date
                <input type="date" {...register("dueDate", { required: "Due date is required" })} />
              </label>
              <label>
                Status
                <select {...register("status")}>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                </select>
              </label>
            </div>
          </section>

          <section className="section-card">
            <div className="card-title">
              <div>
                <h2>Line items</h2>
                <p>Add the products or services being billed.</p>
              </div>
              <button type="button" className="secondary" onClick={() => append({ ...blankItem })}>
                <Plus size={16} /> Add item
              </button>
            </div>

            <div className="line-items">
              <div className="line-head">
                <span>Description</span><span>Qty</span><span>Unit price</span><span>Total</span><span />
              </div>
              {fields.map((field, index) => {
                const quantity = Number(items[index]?.quantity || 0);
                const unitPrice = Number(items[index]?.unitPrice || 0);
                return (
                  <div className="line-row" key={field.id}>
                    <input placeholder="Website development" {...register(`items.${index}.description`, { required: "Description is required" })} />
                    <input type="number" min="1.0" step="1.0" {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1.0 })} />
                    <input type="number" min="0" step="5" {...register(`items.${index}.unitPrice`, { valueAsNumber: true, min: 0 })} />
                    <strong>${(quantity * unitPrice).toFixed(2)}</strong>
                    <button type="button" className="icon-btn danger" disabled={fields.length === 1} onClick={() => remove(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="section-card summary-card">
            <div className="tax-field">
              <label>
                Tax rate (%)
                <input type="number" min="0" max="100" step="0.01" {...register("taxPercent", { valueAsNumber: true, min: 0, max: 100 })} />
              </label>
            </div>
            <div className="totals">
              <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              <div><span>Tax</span><strong>${tax.toFixed(2)}</strong></div>
              <div className="grand"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            </div>
          </section>
        </div>

        {Object.values(errors).map((error, index) =>
          error?.message && error.type !== "root" ? <div className="field-error" key={index}>{error.message}</div> : null,
        )}

        <div className="form-actions">
          <Link className="secondary" to="/invoices">Cancel</Link>
          <button className="primary" disabled={isSubmitting}>
            <Save size={17} />
            {isSubmitting ? "Creating…" : "Create invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
