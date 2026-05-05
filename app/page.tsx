"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
    // Redirect to dashboard (or login if auth is configured)
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="auth-layout">
      <div style={{ textAlign: "center" }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", margin: "0 auto var(--space-4)" }} />
        <div className="skeleton" style={{ width: 120, height: 20, borderRadius: "var(--radius-sm)", margin: "0 auto" }} />
      </div>
    </div>
  );
}
