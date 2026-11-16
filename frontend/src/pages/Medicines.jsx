import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Pencil, Trash2, ScanBarcode } from "lucide-react";
import { Card, Modal, Pill, Table, inputCls, btn, btnGhost } from "../components/ui.jsx";
import { statusOf, inr } from "../data.js";

const blank = { code: "", name: "", brand: "", qty: "", mfg: "", exp: "", price: "" };

export default function Medicines() {
  const { medicines, setMedicines } = useOutletContext();
  const [q, setQ] = useState("");
  const [scan, setScan] = useState("");
  const [form, setForm] = useState(null); // null = closed
  const shown = medicines.filter((m) => (m.name + m.brand + m.code).toLowerCase().includes(q.toLowerCase()));

  // USB/Bluetooth barcode scanners type the code and press Enter, so this input just works.
  const onScan = (e) => {
    if (e.key !== "Enter" || !scan.trim()) return;
    const hit = medicines.find((m) => m.code === scan.trim());
    if (hit) setQ(hit.code); else setForm({ ...blank, code: scan.trim() });
    setScan("");
  };

  const save = (e) => {
    e.preventDefault();
    const row = { ...form, qty: Number(form.qty), price: Number(form.price) };
    setMedicines(form.id ? medicines.map((m) => (m.id === form.id ? row : m)) : [...medicines, { ...row, id: Date.now() }]);
    setForm(null);
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Card title="Medicines" action={<button className={`${btn} flex items-center gap-2`} onClick={() => setForm(blank)}><Plus size={16} />Add medicine</button>}>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <input className={inputCls} placeholder="Search by name, brand or code" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="relative block">
          <ScanBarcode size={18} className="absolute left-3 top-3 text-forest" />
          <input className={`${inputCls} pl-10`} placeholder="Scan barcode here, then press Enter" value={scan}
            onChange={(e) => setScan(e.target.value)} onKeyDown={onScan} />
        </label>
      </div>
      <Table head={["S.No", "Product name", "Brand", "Qty", "Mfg date", "Expiry date", "Price", "Product code", "Status", "Action"]}>
        {shown.map((m, i) => (
          <tr key={m.id}>
            <td>{i + 1}</td><td className="font-medium">{m.name}</td><td>{m.brand}</td><td>{m.qty}</td>
            <td>{m.mfg}</td><td>{m.exp}</td><td>{inr(m.price)}</td><td className="font-mono text-xs">{m.code}</td>
            <td><Pill kind={statusOf(m)} /></td>
            <td>
              <div className="flex gap-1">
                <button aria-label={`Edit ${m.name}`} onClick={() => setForm(m)} className="rounded-full p-2 hover:bg-sage/40"><Pencil size={16} /></button>
                <button aria-label={`Delete ${m.name}`} onClick={() => setMedicines(medicines.filter((x) => x.id !== m.id))} className="rounded-full p-2 hover:bg-sage/40"><Trash2 size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      {!shown.length && <p className="py-6 text-center text-sm">No medicines match. Scan a new barcode or add one.</p>}

      {form && (
        <Modal title={form.id ? "Edit medicine" : "Add medicine"} onClose={() => setForm(null)}>
          <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
            <input required className={`${inputCls} sm:col-span-2`} placeholder="Product code (barcode)" value={form.code} onChange={set("code")} />
            <input required className={inputCls} placeholder="Product name" value={form.name} onChange={set("name")} />
            <input required className={inputCls} placeholder="Brand" value={form.brand} onChange={set("brand")} />
            <input required type="number" min="0" className={inputCls} placeholder="Quantity" value={form.qty} onChange={set("qty")} />
            <input required type="number" min="0" className={inputCls} placeholder="Price (₹)" value={form.price} onChange={set("price")} />
            <label className="text-xs">Manufactured<input required type="date" className={inputCls} value={form.mfg} onChange={set("mfg")} /></label>
            <label className="text-xs">Expiry<input required type="date" className={inputCls} value={form.exp} onChange={set("exp")} /></label>
            <div className="flex gap-3 sm:col-span-2"><button className={btn}>Save medicine</button>
              <button type="button" className={btnGhost} onClick={() => setForm(null)}>Cancel</button></div>
          </form>
        </Modal>
      )}
    </Card>
  );
}
