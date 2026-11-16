import { Link } from "react-router-dom";
import { btn, btnGhost } from "../components/ui.jsx";
import heroArt from "../assets/home-art.jpeg";

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
          {/* cream card hides the image's white background */}
          <div className="rounded-[2rem] bg-cream p-4 shadow-lg sm:p-6">
            <img
              src={heroArt}
              alt="Pharmacists managing medicine stock"
              className="mx-auto aspect-[4/3] w-full rounded-3xl object-contain mix-blend-multiply"
            />
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
