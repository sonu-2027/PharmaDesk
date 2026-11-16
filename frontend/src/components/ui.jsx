import { X } from "lucide-react";

export const inputCls =
  "w-full rounded-2xl border border-sage bg-paper px-4 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/30";
export const btn =
  "rounded-2xl bg-forest px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-ink focus-visible:ring-2 focus-visible:ring-forest/50 focus-visible:outline-none";
export const btnGhost =
  "rounded-2xl border border-forest px-5 py-2.5 text-sm font-semibold text-forest transition hover:bg-forest hover:text-paper";

export const Card = ({ title, action, className = "", children }) => (
  <section className={`rounded-3xl bg-cream/80 p-5 ${className}`}>
    {(title || action) && (
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-forest">{title}</h3>
        {action}
      </div>
    )}
    {children}
  </section>
);

export function Ring({ value, label, color = "#EDC69B" }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-forest p-4 text-cream">
      <span className="text-sm">{label}</span>
      <svg width="88" height="88" viewBox="0 0 88 88" role="img" aria-label={`${label} ${value}%`}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="7" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 44 44)" />
        <text x="44" y="49" textAnchor="middle" className="fill-cream text-[15px] font-semibold">{value}%</text>
      </svg>
    </div>
  );
}

const tones = {
  ok: "bg-sage/60 text-ink", low: "bg-peach text-ink",
  out: "bg-rust text-paper", expired: "bg-rust text-paper",
  Delivered: "bg-sage/60 text-ink", Shipped: "bg-peach text-ink", Pending: "bg-cream text-ink ring-1 ring-forest/40",
};
const names = { ok: "In stock", low: "Low stock", out: "Out of stock", expired: "Expired" };
export const Pill = ({ kind }) => (
  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${tones[kind]}`}>{names[kind] || kind}</span>
);

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-paper p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-forest">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-cream"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Table = ({ head, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[720px] text-left text-sm">
      <thead><tr className="text-forest">{head.map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
      <tbody className="[&>tr]:border-t [&>tr]:border-sage/60 [&>tr>td]:px-3 [&>tr>td]:py-3">{children}</tbody>
    </table>
  </div>
);
