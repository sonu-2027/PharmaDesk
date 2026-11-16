import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Ring, Pill } from "../components/ui.jsx";
import { api } from "../api";
import { inr } from "../utils";

function List({ items, kind, empty }) {
  if (!items.length) return <p className="text-sm">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((m) => (
        <li
          key={m.id}
          className="flex items-center justify-between gap-2 rounded-full bg-paper px-4 py-2 text-sm"
        >
          <span className="truncate font-medium">{m.name}</span>
          <span className="flex items-center gap-2 text-xs">
            {kind === "expired" ? m.exp : `${m.qty} left`}
            <Pill kind={kind} />
          </span>
        </li>
      ))}
    </ul>
  );
}

const empty = {
  week_sales: [],
  week_total: 0,
  out: [],
  expired: [],
  low: [],
  healthy_pct: 0,
  in_date_pct: 0,
  delivered_pct: 0,
};

export default function Dashboard() {
  const { medicines } = useOutletContext(); // changes after a sale or edit, so the dashboard refreshes
  const [d, setD] = useState(empty);
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/dashboard")
      .then(setD)
      .catch((e) => setErr(e.message));
  }, [medicines]);

  const max = Math.max(1, ...d.week_sales.map((s) => s.v));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_200px]">
      {err && (
        <p role="alert" className="text-sm text-rust lg:col-span-2">
          {err}
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <Card
          title="Sales report"
          className="md:col-span-2"
          action={
            <span className="text-sm font-semibold">
              {inr(d.week_total)} this week
            </span>
          }
        >
          <div className="flex h-40 items-end gap-3">
            {d.week_sales.map((s) => (
              <div
                key={s.d}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <div
                  className="w-full rounded-full bg-forest"
                  style={{ height: `${(s.v / max) * 85}%` }}
                  title={inr(s.v)}
                />
                <span className="text-xs">{s.d}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Out of stock">
          <List items={d.out} kind="out" empty="Nothing is out of stock." />
        </Card>
        <Card title="Expired">
          <List
            items={d.expired}
            kind="expired"
            empty="No expired medicines."
          />
        </Card>
        <Card title="Low stock" className="md:col-span-2">
          <List items={d.low} kind="low" empty="No low-stock items." />
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:content-start">
        <Ring value={d.healthy_pct} label="Healthy stock" />
        <Ring value={d.in_date_pct} label="In-date stock" color="#B3C58B" />
        <Ring
          value={d.delivered_pct}
          label="Orders delivered"
          color="#FCF6D2"
        />
      </div>
    </div>
  );
}
