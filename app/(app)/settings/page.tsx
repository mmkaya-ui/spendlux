"use client";

import { useState, useEffect } from "react";
import { User, Globe, Bell, Shield, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState(true);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("spendlux-gemini-key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem("spendlux-gemini-key", val);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>{t.settings}</h1>
        <p>{t.profile}</p>
      </div>

      {/* Profile Section */}
      <div className="glass" style={{ padding: "var(--space-6)", marginBottom: "var(--space-5)" }} id="settings-profile">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
          <User size={18} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>Profile</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          <div>
            <label className="input-label" htmlFor="settings-name">Display Name</label>
            <input className="input-field" id="settings-name" defaultValue="Demo User" />
          </div>
          <div>
            <label className="input-label" htmlFor="settings-email">Email</label>
            <input className="input-field" id="settings-email" defaultValue="demo@spendlux.app" disabled style={{ opacity: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass" style={{ padding: "var(--space-6)", marginBottom: "var(--space-5)" }} id="settings-preferences">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
          <Globe size={18} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>{t.preferences}</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <label className="input-label" htmlFor="settings-language">{t.language}</label>
            <select 
              className="input-field" 
              id="settings-language" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)} 
              style={{ maxWidth: 200 }}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>
          <div>
            <label className="input-label" htmlFor="settings-currency">{t.currency}</label>
            <select className="input-field" id="settings-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ maxWidth: 200 }}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>
          <div>
            <label className="input-label" htmlFor="settings-apikey">Google Gemini API Key (BYOK)</label>
            <input 
              type="password"
              className="input-field" 
              id="settings-apikey" 
              placeholder="AIzaSy..."
              value={apiKey} 
              onChange={(e) => handleApiKeyChange(e.target.value)} 
              style={{ maxWidth: 400 }}
            />
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: "var(--space-1)" }}>
              If provided, this app will use your personal API key instead of the server default. Stored locally.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-3) 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <Bell size={16} style={{ color: "var(--text-secondary)" }} />
              <div>
                <p style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Push Notifications</p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Get alerted when processing is complete</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                width: 44, height: 24, borderRadius: 12, padding: 2,
                background: notifications ? "var(--accent)" : "var(--border)",
                border: "none", cursor: "pointer", transition: "background var(--duration-fast)",
                position: "relative",
              }}
              id="toggle-notifications"
              role="switch"
              aria-checked={notifications}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "white",
                transition: "transform var(--duration-fast)",
                transform: notifications ? "translateX(20px)" : "translateX(0)",
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass" style={{ padding: "var(--space-6)", marginBottom: "var(--space-5)" }} id="settings-security">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
          <Shield size={18} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>Security</h3>
        </div>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Change Password</span>
            <button className="btn btn-secondary" style={{ fontSize: "var(--text-xs)" }}>Update</button>
          </div>
          <div className="divider" style={{ margin: "0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Two-Factor Authentication</span>
            <span className="badge badge-warning">Coming soon</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass" style={{ padding: "var(--space-6)", borderColor: "rgba(193, 119, 103, 0.2)" }} id="settings-danger">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
          <Trash2 size={18} style={{ color: "var(--negative)" }} />
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--negative)" }}>Danger Zone</h3>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Delete Account</p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Permanently delete your account and all data</p>
          </div>
          <button className="btn btn-danger" style={{ fontSize: "var(--text-xs)" }}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}
