import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Printer, Trash2 } from "lucide-react";
import { Card, Pill, Table, inputCls, btn, btnGhost } from "../components/ui.jsx";
import { seedOrders, inr, statusOf } from "../data.js";

export function Orders() {
  const [orders] = useState(seedOrders);
  return (
    <Card title="Supplier orders">
      <Table head={["Order ID", "Supplier", "Items", "Total", "Date", "Status"]}>
        {orders.map((o) => (
          <tr key={o.id}><td className="font-mono text-xs">{o.id}</td><td className="font-medium">{o.supplier}</td>
            <td>{o.items}</td><td>{inr(o.total)}</td><td>{o.date}</td><td><Pill kind={o.status} /></td></tr>
        ))}
      </Table>
    </Card>
  );
}

export function Invoice() {
  const { medicines } = useOutletContext();
  const [lines, setLines] = useState([]);
  const [scan, setScan] = useState("");
  const [customer, setCustomer] = useState("");
  const [msg, setMsg] = useState("");
  const total = lines.reduce((a, l) => a + l.price * l.qty, 0);

  const add = (e) => {
    if (e.key !== "Enter" || !scan.trim()) return;
    const m = medicines.find((x) => x.code === scan.trim() || x.name.toLowerCase() === scan.trim().toLowerCase());
    setScan("");
    if (!m) return setMsg("No medicine with that code. Check the code or add it under Medicines.");
    if (statusOf(m) === "expired") return setMsg(`${m.name} is expired and cannot be sold.`);
    if (m.qty === 0) return setMsg(`${m.name} is out of stock.`);
    setMsg("");
    setLines((ls) => ls.some((l) => l.id === m.id)
      ? ls.map((l) => (l.id === m.id ? { ...l, qty: Math.min(l.qty + 1, m.qty) } : l))
      : [...ls, { id: m.id, name: m.name, price: m.price, qty: 1 }]);
  };

  return (
    <Card title="New invoice">
      <div className="no-print mb-4 grid gap-3 sm:grid-cols-2">
        <input className={inputCls} placeholder="Customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
        <input className={inputCls} placeholder="Scan barcode or type a name, then press Enter" value={scan}
          onChange={(e) => setScan(e.target.value)} onKeyDown={add} />
      </div>
      {msg && <p role="alert" className="mb-3 text-sm text-rust">{msg}</p>}
      {customer && <p className="mb-2 text-sm">Billed to: <b>{customer}</b></p>}
      <Table head={["Item", "Price", "Qty", "Amount", ""]}>
        {lines.map((l) => (
          <tr key={l.id}><td className="font-medium">{l.name}</td><td>{inr(l.price)}</td><td>{l.qty}</td><td>{inr(l.price * l.qty)}</td>
            <td className="no-print"><button aria-label={`Remove ${l.name}`} onClick={() => setLines(lines.filter((x) => x.id !== l.id))}><Trash2 size={16} /></button></td></tr>
        ))}
      </Table>
      {!lines.length && <p className="py-6 text-center text-sm">No items yet. Scan a barcode to add the first one.</p>}
      <div className="mt-4 flex items-center justify-between">
        <div className="font-display text-2xl font-bold">Total {inr(total)}</div>
        <div className="no-print flex gap-3">
          <button className={btnGhost} onClick={() => setLines([])}>Clear</button>
          <button className={`${btn} flex items-center gap-2 disabled:opacity-50`} disabled={!lines.length} onClick={() => window.print()}><Printer size={16} />Print invoice</button>
        </div>
      </div>
    </Card>
  );
}
