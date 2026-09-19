import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api, saveSession } from "../api";

export default function Login() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await api("/auth/login", {
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
          <div className="eyebrow">WORKSPACE ACCESS</div>
          <h1>Welcome back.</h1>
          <p>Manage clients, invoices and payment status from one focused workspace.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
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
              })}
            />
          </label>
          {errors.password && <div className="field-error">{errors.password.message}</div>}

          {errors.root && <div className="alert error">{errors.root.message}</div>}
          <button className="primary full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div className="visual-card">
          <span className="visual-label">MONTHLY REVENUE</span>
          <strong>$48,290</strong>
          <div className="visual-line">
            <span /><span /><span /><span /><span /><span /><span />
          </div>
          <small>+18.4% from last month</small>
        </div>
        <div className="visual-note">
          <span>01</span>
          <div>
            <strong>Simple by design</strong>
            <p>Everything you need to send professional invoices without the clutter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
