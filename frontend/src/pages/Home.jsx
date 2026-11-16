import { Link } from "react-router-dom";
import { btn, btnGhost } from "../components/ui.jsx";
import heroArt from "../assets/home-art2.jpeg";

const features = [
  { c: "bg-peach", t: "Stock", s: "Low and out-of-stock alerts" },
  { c: "bg-cream", t: "Expiry", s: "Catch expired batches early" },
  { c: "bg-sage", t: "Invoices", s: "Scan a barcode, bill in seconds" },
  {
    c: "bg-forest text-paper",
    t: "Orders",
    s: "Track every supplier delivery",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl font-bold text-forest">
          PharmaDesk
        </span>
        <div className="flex gap-3">
          <Link to="/login" className={btnGhost}>
            Log in
          </Link>
          <Link to="/register" className={btn}>
            Register
          </Link>
        </div>
      </header>

      {/* Hero: text left, image right (image on top on mobile) */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-10 pt-6 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-ink md:text-6xl">
            Know what is on every shelf.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink">
            Track medicines, expiry dates, invoices and supplier orders for your
            pharmacy in one calm place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className={btn}>
              Create pharmacy account
            </Link>
            <Link to="/login" className={btnGhost}>
              Log in
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-sage shadow-lg">
            <img
              src={heroArt}
              alt="Pharmacists working among oversized medicine bottles"
              className="h-full w-full scale-110 object-cover saturate-[.75]"
            />
            {/* soft forest tint so the lime sits inside your palette */}
            <div className="pointer-events-none absolute inset-0 bg-forest/10 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* Feature capsules, moved below the hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 pb-16 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.t}
            className={`${f.c} rounded-[2rem] px-5 py-6 text-center`}
          >
            <div className="font-display text-lg font-bold">{f.t}</div>
            <div className="mt-1 text-sm leading-snug">{f.s}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
