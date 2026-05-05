"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="auth-layout">
      <div className="auth-card glass" style={{ textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "var(--radius-xl)",
          background: "var(--warning-muted)", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto var(--space-5)",
          border: "1px solid rgba(212, 167, 106, 0.2)",
        }}>
          <WifiOff size={28} style={{ color: "var(--warning)" }} />
        </div>
        <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-3)" }}>
          You&apos;re Offline
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-6)" }}>
          SpendLux needs an internet connection to sync your data.
          Please check your connection and try again.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
