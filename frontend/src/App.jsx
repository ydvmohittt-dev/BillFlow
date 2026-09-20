import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import Invoices from "./pages/Invoices";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceDetails from "./pages/InvoiceDetails";
import Settings from "./pages/Settings";
import User from "./pages/User";
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "clients", element: <Clients /> },
      { path: "clients/new", element: <ClientForm /> },
      { path: "clients/:id/edit", element: <ClientForm /> },
      { path: "invoices", element: <Invoices /> },
      { path: "invoices/new", element: <InvoiceForm /> },
      { path: "invoices/:id", element: <InvoiceDetails /> },
      { path: "settings", element: <Settings /> },
       { path: "settings/user", element: <User /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
