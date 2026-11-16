import { Link } from "react-router-dom";
import { btn, btnGhost } from "../components/ui.jsx";

// Tall capsules echo the palette swatches and the pill shape of the product itself.
const caps = [
  { c: "bg-peach", h: "h-64", t: "Stock", s: "Low and out-of-stock alerts" },
  { c: "bg-cream", h: "h-80", t: "Expiry", s: "Catch expired batches early" },
  { c: "bg-sage", h: "h-72", t: "Invoices", s: "Scan a barcode, bill in seconds" },
  { c: "bg-forest text-paper", h: "h-96", t: "Orders", s: "Track every supplier delivery" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl font-bold text-forest">PharmaDesk</span>
        <div className="flex gap-3"><Link to="/login" className={btnGhost}>Log in</Link><Link to="/register" className={btn}>Register</Link></div>
      </header>
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-6 pb-16 pt-8 lg:grid-cols-2">
        <div className="pb-6">
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl">Know what is on every shelf.</h1>
          <p className="mt-5 max-w-md text-lg">Track medicines, expiry dates, invoices and supplier orders for your pharmacy in one calm place.</p>
          <div className="mt-8 flex gap-3"><Link to="/register" className={btn}>Create pharmacy account</Link><Link to="/login" className={btnGhost}>Log in</Link></div>
        </div>
        <div className="flex items-end justify-center gap-3">
          {caps.map((k) => (
            <div key={k.t} className={`${k.c} ${k.h} flex w-24 flex-col justify-end rounded-full px-3 pb-6 text-center sm:w-28`}>
              <div className="font-display font-bold">{k.t}</div>
              <div className="mt-1 text-xs leading-snug">{k.s}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
