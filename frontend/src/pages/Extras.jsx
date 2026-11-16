import { useState } from "react";
import { Card, inputCls, btn } from "../components/ui.jsx";

export function Settings() {
  const user = JSON.parse(localStorage.getItem("pharmaUser") || "{}");
  const [f, setF] = useState({ name: user.name || "", pharmacy: user.pharmacy || "", limit: 20 });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setSaved(false); };
  const save = (e) => {
    e.preventDefault();
    localStorage.setItem("pharmaUser", JSON.stringify({ name: f.name, pharmacy: f.pharmacy }));
    setSaved(true);
  };
  return (
    <Card title="Settings" className="max-w-xl">
      <form onSubmit={save} className="space-y-3">
        <label className="block text-sm">Your name<input className={inputCls} value={f.name} onChange={set("name")} /></label>
        <label className="block text-sm">Pharmacy name<input className={inputCls} value={f.pharmacy} onChange={set("pharmacy")} /></label>
        <label className="block text-sm">Low-stock alert at (units)<input type="number" min="1" className={inputCls} value={f.limit} onChange={set("limit")} /></label>
        <div className="flex items-center gap-3"><button className={btn}>Save settings</button>{saved && <span role="status" className="text-sm">Saved</span>}</div>
      </form>
    </Card>
  );
}

const faqs = [
  ["How do I add a medicine with a barcode?", "Open Medicines, click the scan box, and scan the pack. If the code is new, the add form opens with the code filled in."],
  ["Why can't I add an item to an invoice?", "Expired and out-of-stock medicines are blocked from sale. Update the stock under Medicines first."],
  ["When is an item marked low stock?", "When 20 units or fewer are left."],
];

export function Help() {
  return (
    <Card title="Help & support" className="max-w-2xl">
      <div className="space-y-2">
        {faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl bg-paper px-4 py-3">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-sm">{a}</p>
          </details>
        ))}
      </div>
      <p className="mt-5 text-sm">Still stuck? Write to <a className="font-semibold text-forest underline" href="mailto:support@pharmadesk.example">support@pharmadesk.example</a>.</p>
    </Card>
  );
}
