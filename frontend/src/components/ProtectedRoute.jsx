import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, clearSession } from "../api";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("invoice_token")) {
      setLoading(false);
      return;
    }

    api("/auth/me")
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("invoice_user", JSON.stringify(data.user));
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="screen-center">
        <div className="loader" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
