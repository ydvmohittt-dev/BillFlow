import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api, saveSession } from "../api";

export default function Register() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      saveSession(result);
      nav("/");
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BillFlow</strong>
            <span>Modern invoicing</span>
          </div>
        </div>
        <div className="auth-copy">
          <div className="eyebrow">GET STARTED</div>
          <h1>Create your workspace.</h1>
          <p>Set up a secure account and start organizing your invoicing workflow.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
          <label>
            Full name
            <input
              {...register("name", {
                required: "Name is required",
              })}
            />
          </label>
          {errors.name && <div className="field-error">{errors.name.message}</div>}

          <label>
            Email
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            />
          </label>
          {errors.email && <div className="field-error">{errors.email.message}</div>}

          <label>
            Password
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
          </label>
          {errors.password && <div className="field-error">{errors.password.message}</div>}

          {errors.root && <div className="alert error">{errors.root.message}</div>}
          <button className="primary full" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-visual register-visual">
        <div className="visual-note large">
          <span>02</span>
          <div>
            <strong>Built for real workflows</strong>
            <p>Clients, invoices, tax calculations and status tracking — connected through a REST API.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
