"use client";

import { useState } from "react";
import { Menu, Wallet } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <div className="mobile-header">
        <button
          className="btn-icon btn-ghost"
          onClick={() => setSidebarOpen(true)}
          id="btn-menu"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Wallet size={18} style={{ color: "var(--accent)" }} />
          <span style={{ fontWeight: 600, fontSize: "var(--text-base)" }}>SpendLux</span>
        </div>
        <div style={{ width: 36 }} /> {/* Spacer for centering */}
      </div>

      <main className="app-main">
        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}
