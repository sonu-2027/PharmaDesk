import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, inputCls, btn } from "../components/ui.jsx";
import { api } from "../api";

export function Settings() {
  const { reloadMedicines } = useOutletContext();
  const [f, setF] = useState({ name: "", pharmacy: "", limit: 20 });
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  // Load the real profile from PostgreSQL
  useEffect(() => {
    api("/auth/me")
      .then((u) =>
        setF({ name: u.name, pharmacy: u.pharmacy, limit: u.low_stock_limit }),
      )
      .catch((e) => setErr(e.message));
  }, []);

  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const u = await api("/auth/me", {
        method: "PUT",
        body: {
          name: f.name,
          pharmacy: f.pharmacy,
          low_stock_limit: Number(f.limit),
        },
      });
      // keep the header/sidebar name in sync
      localStorage.setItem(
        "pharmaUser",
        JSON.stringify({ name: u.name, pharmacy: u.pharmacy }),
      );
      await reloadMedicines(); // low/ok status depends on the limit
      setSaved(true);
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Settings" className="max-w-xl">
      <form onSubmit={save} className="space-y-3">
        <label className="block text-sm">
          Your name
          <input
            required
            className={inputCls}
            value={f.name}
            onChange={set("name")}
          />
        </label>
        <label className="block text-sm">
          Pharmacy name
          <input
            required
            className={inputCls}
            value={f.pharmacy}
            onChange={set("pharmacy")}
          />
        </label>
        <label className="block text-sm">
          Low-stock alert at (units)
          <input
            required
            type="number"
            min="1"
            className={inputCls}
            value={f.limit}
            onChange={set("limit")}
          />
        </label>
        {err && (
          <p role="alert" className="text-sm text-rust">
            {err}
          </p>
        )}
        <div className="flex items-center gap-3">
          <button disabled={saving} className={`${btn} disabled:opacity-60`}>
            {saving ? "Saving..." : "Save settings"}
          </button>
          {saved && (
            <span role="status" className="text-sm">
              Saved
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

const faqs = [
  [
    "How do I add a medicine with a barcode?",
    "Open Medicines, click the scan box, and scan the pack. If the code is new, the add form opens with the code filled in.",
  ],
  [
    "Why can't I add an item to an invoice?",
    "Expired and out-of-stock medicines are blocked from sale. Update the stock under Medicines first.",
  ],
  [
    "When is an item marked low stock?",
    "When the units left reach the low-stock limit you set under Settings (20 by default).",
  ],
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
      <p className="mt-5 text-sm">
        Still stuck? Write to{" "}
        <a
          className="font-semibold text-forest underline"
          href="mailto:support@pharmadesk.example"
        >
          support@pharmadesk.example
        </a>
        .
      </p>
    </Card>
  );
}
