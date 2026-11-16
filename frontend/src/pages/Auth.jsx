import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { inputCls, btn } from "../components/ui.jsx";
import { api, saveSession } from "../api";

export default function Auth({ mode }) {
  const isReg = mode === "register";
  const navigate = useNavigate();
  const [f, setF] = useState({
    name: "",
    pharmacy: "",
    license: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.password.length < 6)
      return setErr("Password must be at least 6 characters.");
    setErr("");
    setLoading(true);
    try {
      const data = await api(isReg ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: isReg ? f : { email: f.email, password: f.password },
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
    <main className="grid min-h-screen place-items-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-[2rem] bg-paper p-8 shadow-lg"
      >
        <Link to="/" className="font-display text-xl font-bold text-forest">
          PharmaDesk
        </Link>
        <h1 className="font-display text-3xl font-bold">
          {isReg ? "Register your pharmacy" : "Welcome back"}
        </h1>
        {isReg && (
          <>
            <input
              required
              className={inputCls}
              placeholder="Your full name"
              value={f.name}
              onChange={set("name")}
            />
            <input
              required
              className={inputCls}
              placeholder="Pharmacy name"
              value={f.pharmacy}
              onChange={set("pharmacy")}
            />
            <input
              required
              className={inputCls}
              placeholder="Drug licence number"
              value={f.license}
              onChange={set("license")}
            />
          </>
        )}
        <input
          required
          type="email"
          className={inputCls}
          placeholder="Email"
          value={f.email}
          onChange={set("email")}
        />
        <input
          required
          type="password"
          className={inputCls}
          placeholder="Password"
          value={f.password}
          onChange={set("password")}
        />
        {err && (
          <p role="alert" className="text-sm text-rust">
            {err}
          </p>
        )}
        <button
          disabled={loading}
          className={`${btn} w-full disabled:opacity-60`}
        >
          {loading ? "Please wait..." : isReg ? "Create account" : "Log in"}
        </button>
        <p className="text-center text-sm">
          {isReg ? "Already registered? " : "New pharmacy? "}
          <Link
            className="font-semibold text-forest underline"
            to={isReg ? "/login" : "/register"}
          >
            {isReg ? "Log in" : "Register"}
          </Link>
        </p>
      </form>
    </main>
  );
}
