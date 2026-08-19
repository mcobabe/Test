"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to sign in.");
        return;
      }
      if (data.role === "candidate") router.push("/candidate");
      else if (data.role === "abc_admin" || data.role === "abc_staff") router.push("/admin");
      else router.push("/member");
      router.refresh();
    } catch {
      setError("Unable to connect to the login service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell narrow-shell">
      <section className="auth-card">
        <div className="eyebrow">ABC NORCAL WORKFORCE EXCHANGE</div>
        <h1>Sign In</h1>
        <p className="muted">Candidates, ABC member contractors and ABC administrators use the same secure sign-in.</p>
        <form onSubmit={submit} className="stack-lg">
          <label className="field-label">Email
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          <label className="field-label">Password
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" minLength={8} required />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          <button className="primary-button full-button" disabled={loading}>{loading ? "Signing In…" : "Sign In"}</button>
        </form>
        <div className="auth-help">
          <a href="/candidate/signup">Create candidate profile</a>
          <span>·</span>
          <a href="/">Return home</a>
        </div>
      </section>
    </main>
  );
}
