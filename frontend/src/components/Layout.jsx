import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, ShoppingBag, Pill, Settings, LifeBuoy, LogOut, Bell, Search } from "lucide-react";

const nav = [
  { to: "/app", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/invoice", label: "Invoice", icon: FileText },
  { to: "/app/orders", label: "Orders", icon: ShoppingBag },
  { to: "/app/medicines", label: "Medicines", icon: Pill },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/help", label: "Help & support", icon: LifeBuoy },
];

export default function Layout({ ctx }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("pharmaUser") || "{}");
  const logout = () => { localStorage.removeItem("pharmaUser"); navigate("/"); };
  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-l-2xl px-4 py-3 text-sm font-medium transition ${
      isActive ? "bg-paper text-forest" : "text-ink hover:bg-paper/50"}`;

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-paper shadow-lg">
        <aside className="hidden w-60 shrink-0 flex-col bg-cream py-6 pl-4 md:flex">
          <div className="mb-6 pl-2 font-display text-2xl font-bold text-forest">PharmaDesk</div>
          <div className="mb-6 flex items-center gap-3 pl-2">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-peach font-display text-lg font-bold">
              {(user.name || "P")[0]}
            </div>
            <div className="text-sm leading-tight"><div className="font-semibold">{user.name || "Pharmacist"}</div>
              <div className="text-forest">{user.pharmacy || "Your pharmacy"}</div></div>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {nav.map(({ icon: Icon, label, ...rest }) => (
              <NavLink key={label} {...rest} className={link}><Icon size={18} />{label}</NavLink>
            ))}
          </nav>
          <button onClick={logout} className="mt-4 flex items-center gap-3 px-4 py-3 text-sm font-medium hover:text-rust">
            <LogOut size={18} /> Log out
          </button>
        </aside>

        <div className="min-w-0 flex-1 p-4 md:p-8">
          <nav className="mb-4 flex gap-2 overflow-x-auto md:hidden">
            {nav.map(({ icon: Icon, label, ...rest }) => (
              <NavLink key={label} {...rest} className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium ${isActive ? "bg-forest text-paper" : "bg-cream"}`}>
                <Icon size={14} />{label}</NavLink>
            ))}
          </nav>
          <header className="mb-6 flex items-center justify-between gap-4">
            <h1 className="font-display text-2xl font-bold md:text-3xl">Hello, {(user.name || "there").split(" ")[0]}!</h1>
            <div className="flex items-center gap-3">
              <label className="hidden items-center gap-2 rounded-full bg-cream px-4 py-2 sm:flex">
                <Search size={16} className="text-forest" />
                <input aria-label="Search" placeholder="Search" className="w-40 bg-transparent text-sm outline-none" />
              </label>
              <button aria-label="Notifications" className="rounded-full bg-cream p-2.5"><Bell size={18} /></button>
              <button onClick={logout} aria-label="Log out" className="rounded-full bg-cream p-2.5 md:hidden"><LogOut size={18} /></button>
            </div>
          </header>
          <Outlet context={ctx} />
        </div>
      </div>
    </div>
  );
}
