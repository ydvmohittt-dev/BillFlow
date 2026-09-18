import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../api";
import { ArrowLeft, Save } from "../components/Icons";

const empty = { name: "", email: "", phone: "", billingAddress: "" };

export default function ClientForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: empty });

  useEffect(() => {
    if (!edit) return;

    api("/clients")
      .then((clients) => {
        const client = clients.find((item) => item._id === id);
        if (client) reset(client);
      })
      .catch((error) => setError("root", { message: error.message }));
  }, [edit, id, reset, setError]);

  const onSubmit = async (data) => {
    try {
      if (edit) {
        await api(`/clients/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        await api("/clients", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      nav("/clients");
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  return (
    <div className="page narrow">
      <Link className="back-link" to="/clients">
        <ArrowLeft size={16} /> Back to clients
      </Link>
      <div className="form-page-head">
        <div>
          <div className="eyebrow">CLIENTS</div>
          <h1>{edit ? "Edit client" : "Add a client"}</h1>
          <p>{edit ? "Update billing contact details." : "Create a billing contact for your workspace."}</p>
        </div>
      </div>

      <form className="section-card form-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-grid">
          <label>
            Client name
            <input {...register("name", { required: "Client name is required" })} placeholder="Enter client name" />
          </label>
          <label>
            Email
            <input type="email" {...register("email", { required: "Email is required" })} placeholder="Enter email address" />
          </label>
          <label>
            Phone
            <input  {...register("phone", { required: "Phone is required" ,pattern: {
      value: /^\+?[0-9\s()-]+$/,
      message: "Please enter a valid phone number",
    }  })} placeholder="Enter contact number" />
          </label>
          <label>
            Billing address
            <textarea {...register("billingAddress", { required: "Billing address is required" })} placeholder="Street, city, postal code" />
          </label>
        </div>

        {Object.values(errors).map((error, index) =>
          error?.message ? <div className="field-error" key={index}>{error.message}</div> : null,
        )}
        {errors.root && <div className="alert error">{errors.root.message}</div>}

        <div className="form-actions">
          <Link className="secondary" to="/clients">Cancel</Link>
          <button className="primary" disabled={isSubmitting}>
            <Save size={17} />
            {isSubmitting ? "Saving…" : edit ? "Save changes" : "Create client"}
          </button>
        </div>
      </form>
    </div>
  );
}
