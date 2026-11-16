import { useOutletContext } from "react-router-dom";
import { Card, Ring, Pill } from "../components/ui.jsx";
import { statusOf, weekSales, inr } from "../data.js";

function List({ items, kind, empty }) {
  if (!items.length) return <p className="text-sm">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-2 rounded-full bg-paper px-4 py-2 text-sm">
          <span className="truncate font-medium">{m.name}</span>
          <span className="flex items-center gap-2 text-xs">{kind === "expired" ? m.exp : `${m.qty} left`}<Pill kind={kind} /></span>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const { medicines } = useOutletContext();
  const by = (k) => medicines.filter((m) => statusOf(m) === k);
  const max = Math.max(...weekSales.map((s) => s.v));
  const total = weekSales.reduce((a, s) => a + s.v, 0);
  const healthy = medicines.length ? Math.round((by("ok").length / medicines.length) * 100) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_200px]">
      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Sales report" className="md:col-span-2" action={<span className="text-sm font-semibold">{inr(total)} this week</span>}>
          <div className="flex h-40 items-end gap-3">
            {weekSales.map((s) => (
              <div key={s.d} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <div className="w-full rounded-full bg-forest" style={{ height: `${(s.v / max) * 85}%` }} title={inr(s.v)} />
                <span className="text-xs">{s.d}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Out of stock"><List items={by("out")} kind="out" empty="Nothing is out of stock." /></Card>
        <Card title="Expired"><List items={by("expired")} kind="expired" empty="No expired medicines." /></Card>
        <Card title="Low stock" className="md:col-span-2"><List items={by("low")} kind="low" empty="No low-stock items." /></Card>
      </div>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:content-start">
        <Ring value={healthy} label="Healthy stock" />
        <Ring value={72} label="Weekly target" color="#B3C58B" />
        <Ring value={90} label="Orders on time" color="#FCF6D2" />
      </div>
    </div>
  );
}
