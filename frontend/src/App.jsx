import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Medicines from "./pages/Medicines.jsx";
import { Orders, Invoice } from "./pages/Orders.jsx";
import { Settings, Help } from "./pages/Extras.jsx";
import { api, getToken } from "./api";

const Protected = ({ children }) =>
  getToken() ? children : <Navigate to="/login" replace />;

// Mounts only after login, so it fetches with a valid token every time.
function AppShell() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const reloadMedicines = useCallback(async () => {
    try {
      setMedicines(await api("/medicines"));
    } catch (e) {
      console.error("Could not load medicines:", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadMedicines();
  }, [reloadMedicines]);

  if (loading) return <p className="p-8">Loading...</p>;

  return <Layout ctx={{ medicines, setMedicines, reloadMedicines }} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route
        path="/app"
        element={
          <Protected>
            <AppShell />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="invoice" element={<Invoice />} />
        <Route path="orders" element={<Orders />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
