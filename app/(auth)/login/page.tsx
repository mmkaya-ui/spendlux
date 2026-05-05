"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
        router.push("/onboarding");
      } else {
        await signInWithEmail(email, password);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim());
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setError("");
    setLoading(true);
    try {
      if (provider === "google") await signInWithGoogle();
      else await signInWithApple();
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim());
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-layout">
      <div className="auth-card glass fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <div style={{
            width: 56, height: 56, borderRadius: "var(--radius-lg)",
            background: "var(--accent-muted)", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto var(--space-4)",
            border: "1px solid var(--accent)",
          }}>
            <Wallet size={28} style={{ color: "var(--accent)" }} />
          </div>
          <h1>SpendLux</h1>
          <p>Your honest financial ledger</p>
        </div>

        {/* OAuth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => handleOAuth("google")}
            disabled={loading}
            id="btn-google-signin"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => handleOAuth("apple")}
            disabled={loading}
            id="btn-apple-signin"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.51-3.23 0-1.44.64-2.2.45-3.06-.4C3.79 16.17 4.36 9.53 8.82 9.29c1.25.06 2.12.7 2.87.73.99-.2 1.94-.77 3-.66 1.27.13 2.22.66 2.84 1.65-2.6 1.56-1.98 4.99.38 5.95-.5 1.2-.93 2.39-1.86 3.32zM12.08 9.21c-.15-2.33 1.83-4.34 4.01-4.52.29 2.5-2.26 4.68-4.01 4.52z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="auth-divider">or</div>

        {/* Email form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {isSignUp && (
            <div>
              <label htmlFor="name" className="input-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input
                  type="text" id="name" className="input-field"
                  placeholder="Your name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: 38 }} required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="input-label">Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
              <input
                type="email" id="email" className="input-field"
                placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 38 }} required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
              <input
                type={showPassword ? "text" : "password"} id="password" className="input-field"
                placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: 38, paddingRight: 38 }}
                minLength={8} required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", padding: 4, color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--negative-muted)", borderRadius: "var(--radius-md)", color: "var(--negative)", fontSize: "var(--text-sm)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            id="btn-email-submit"
            style={{ width: "100%" }}
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: "var(--space-5)" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            style={{ color: "var(--accent)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", font: "inherit" }}
            id="btn-toggle-mode"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>

        </p>
      </div>
    </div>
  );
}
