import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { btn } from "../components/ui.jsx";
import { api, saveSession } from "../api";
import loginArt from "../assets/login-art.jpg";
import registerArt from "../assets/register-art.jpg";

// Outlined pill fields for the dark green panel. The last two classes stop the
// browser's blue autofill colour from clashing with the palette.
const field =
  "w-full rounded-full border border-cream/60 bg-transparent px-5 py-2.5 text-sm text-paper " +
  "placeholder:text-cream/50 outline-none transition focus:border-cream focus:ring-2 focus:ring-cream/30 " +
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#637A60] [&:-webkit-autofill]:[-webkit-text-fill-color:#FFFDF2]";

const Label = ({ text, className = "", children }) => (
  <label className={`block text-sm font-medium text-cream ${className}`}>
    <span className="mb-1.5 block pl-1">{text}</span>
    {children}
  </label>
);

export default function Auth({ mode }) {
  const isReg = mode === "register";
  const navigate = useNavigate();
  const [f, setF] = useState({
    name: "",
    pharmacy: "",
    license: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.password.length < 6)
      return setErr("Password must be at least 6 characters.");
    if (isReg && f.password !== f.confirm)
      return setErr("Passwords do not match.");
    setErr("");
    setLoading(true);
    try {
      const body = isReg
        ? {
            name: f.name,
            pharmacy: f.pharmacy,
            license: f.license,
            email: f.email,
            password: f.password,
          }
        : { email: f.email, password: f.password };
      const data = await api(isReg ? "/auth/register" : "/auth/login", {
        method: "POST",
        body,
      });
      saveSession(data); // expects { token, user: { name, pharmacy } }
      navigate("/app");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-sage/40 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-[2rem] bg-forest shadow-xl md:min-h-[600px]">
        {/* Left: illustration. multiply blend turns the image's white background into the panel colour. */}
        <section className="relative hidden w-1/2 flex-col bg-cream p-8 pr-14 md:flex">
          <Link to="/" className="font-display text-2xl font-bold text-forest">
            PharmaDesk
          </Link>
          <div className="grid flex-1 place-items-center">
            <img
              src={isReg ? registerArt : loginArt}
              alt=""
              className="max-h-[420px] w-full object-contain mix-blend-multiply"
            />
          </div>
        </section>

        {/* Right: form, with a wavy left edge that overlaps the illustration panel */}
        <section className="relative flex w-full flex-col justify-center px-6 py-10 sm:px-10 md:w-1/2 md:pl-16">
          <svg
            aria-hidden="true"
            className="absolute -left-[59px] top-0 hidden h-full w-[60px] md:block"
            viewBox="0 0 60 100"
            preserveAspectRatio="none"
          >
            <path
              d="M60 0 H34 C8 18 46 34 22 50 C-2 66 42 82 26 100 H60 Z"
              fill="#637A60"
            />
          </svg>

          <Link
            to="/"
            className="mb-6 font-display text-2xl font-bold text-cream md:hidden"
          >
            PharmaDesk
          </Link>

          <h1 className="font-display text-3xl font-bold leading-tight text-paper">
            {isReg ? (
              <>
                Hello!
                <br />
                Register your pharmacy
              </>
            ) : (
              <>
                Welcome back!
                <br />
                We are glad to see you :)
              </>
            )}
          </h1>

          <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
            {isReg && (
              <>
                <Label text="Your name">
                  <input
                    required
                    className={field}
                    placeholder="Full name"
                    value={f.name}
                    onChange={set("name")}
                  />
                </Label>
                <Label text="Pharmacy name">
                  <input
                    required
                    className={field}
                    placeholder="Pharmacy name"
                    value={f.pharmacy}
                    onChange={set("pharmacy")}
                  />
                </Label>
                <Label text="Drug licence number" className="sm:col-span-2">
                  <input
                    required
                    className={field}
                    placeholder="Licence number"
                    value={f.license}
                    onChange={set("license")}
                  />
                </Label>
              </>
            )}

            <Label text="Email address" className="sm:col-span-2">
              <input
                required
                type="email"
                className={field}
                placeholder="you@example.com"
                value={f.email}
                onChange={set("email")}
              />
            </Label>

            <Label text="Password" className={isReg ? "" : "sm:col-span-2"}>
              <input
                required
                type="password"
                maxLength={72}
                className={field}
                placeholder="At least 6 characters"
                value={f.password}
                onChange={set("password")}
              />
            </Label>
            {isReg && (
              <Label text="Repeat password">
                <input
                  required
                  type="password"
                  maxLength={72}
                  className={field}
                  placeholder="Repeat password"
                  value={f.confirm}
                  onChange={set("confirm")}
                />
              </Label>
            )}

            {err && (
              <p
                role="alert"
                className="text-sm font-medium text-peach sm:col-span-2"
              >
                {err}
              </p>
            )}

            <button
              disabled={loading}
              className={`${btn} mt-2 w-full !rounded-full !bg-cream !text-forest hover:!bg-peach disabled:opacity-60 sm:col-span-2`}
            >
              {loading ? "Please wait..." : isReg ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-cream">
            {isReg ? "Already registered? " : "New pharmacy? "}
            <Link
              className="font-semibold text-peach underline"
              to={isReg ? "/login" : "/register"}
            >
              {isReg ? "Log in" : "Register"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
