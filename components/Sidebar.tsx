"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Upload,
  CheckSquare,
  Settings,
  LogOut,
  X,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.upload, href: "/upload", icon: Upload },
    { name: t.audit, href: "/audit", icon: CheckSquare },
    { name: t.settings, href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`nav-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "var(--space-6) var(--space-5)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "var(--radius-md)",
                background: "var(--accent-muted)", display: "flex", alignItems: "center",
                justifyContent: "center", border: "1px solid var(--accent)",
              }}>
                <Wallet size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                  SpendLux
                </h2>
                <p style={{ fontSize: "10px", color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Mindful Budgeting
                </p>
              </div>
            </Link>
            {/* Mobile close */}
            <button className="btn-icon btn-ghost" onClick={onClose} style={{ display: "none" }} id="sidebar-close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "var(--space-4) 0", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={onClose}
                id={`nav-${item.name.toLowerCase()}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "var(--space-4) var(--space-3)", borderTop: "1px solid var(--border)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "var(--space-3)",
            padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)",
            background: "var(--bg-overlay)",
          }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: "var(--radius-full)",
              background: "var(--accent-muted)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "var(--text-sm)", fontWeight: 600,
              color: "var(--accent)", flexShrink: 0,
            }}>
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.displayName || "User"}
              </p>
              <p style={{ fontSize: "10px", color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email || "demo@spendlux.app"}
              </p>
            </div>
            <button
              className="btn-icon btn-ghost"
              onClick={signOut}
              title="Sign out"
              id="btn-signout"
              style={{ flexShrink: 0 }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* CSS for mobile close button */}
      <style>{`
        @media (max-width: 768px) {
          #sidebar-close { display: flex !important; }
        }
      `}</style>
    </>
  );
}
