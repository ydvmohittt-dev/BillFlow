import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUser, clearSession } from "../api";
import {
  LayoutDashboard,
  Users,
  FileText,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
} from "./Icons";
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 900;

export default function Layout() {
  const user = getUser();
  const nav = useNavigate();
  const [open, setOpen] = useState(() => window.innerWidth > MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = window.innerWidth <= MOBILE_BREAKPOINT && open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    ["/", "Overview", LayoutDashboard],
    ["/clients", "Clients", Users],
    ["/invoices", "Invoices", FileText],
    ["/invoices/new", "Create invoice", Plus],
    ["/settings", "Settings", Settings],
  ];

  const logout = () => {
    clearSession();
    nav("/login");
  };

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BillFlow</strong>
            <span>Invoicing workspace</span>
          </div>
          <button
            className="icon-btn mobile-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav>
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="account-mini">
            <div className="avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="account-copy">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>
          <div className="topbar-spacer" />
          <div className="avatar top-avatar">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
