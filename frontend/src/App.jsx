import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Medicines from "./pages/Medicines.jsx";
import { Orders, Invoice } from "./pages/Orders.jsx";
import { Settings, Help } from "./pages/Extras.jsx";
import { seedMedicines } from "./data.js";

const Protected = ({ children }) =>
  localStorage.getItem("pharmaUser") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );

export default function App() {
  const [medicines, setMedicines] = useState(seedMedicines);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route
        path="/app"
        element={
          <Protected>
            <Layout ctx={{ medicines, setMedicines }} />
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
