"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Wallet } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/lib/types";

const STEPS = ["Welcome", "Categories", "Currency"];

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    DEFAULT_CATEGORIES.filter((c) => c.type === "expense").map((c) => c.name)
  );
  const [currency, setCurrency] = useState("USD");

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // In a real app, save to Firestore here
      router.push("/dashboard");
    }
  };

  return (
    <div className="onboarding-layout">
      {/* Step dots */}
      <div className="onboarding-steps">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`onboarding-dot ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
          />
        ))}
      </div>

      <div className="onboarding-card glass fade-in" key={step}>
        {step === 0 && (
          <>
            <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "var(--radius-xl)",
                background: "var(--accent-muted)", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto var(--space-5)",
                border: "1px solid var(--accent)",
              }}>
                <Wallet size={32} style={{ color: "var(--accent)" }} />
              </div>
              <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "var(--space-3)" }}>
                Welcome to SpendLux
              </h1>
              <p style={{ color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", maxWidth: 400, margin: "0 auto" }}>
                This is your honest financial ledger. No gamification, no tricks — just clear visibility
                into where your money goes, helping you practice mindful stewardship over your resources.
              </p>
            </div>

            <div style={{
              background: "var(--bg-surface)", borderRadius: "var(--radius-md)",
              padding: "var(--space-5)", marginBottom: "var(--space-6)",
              border: "1px solid var(--border)",
            }}>
              <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--text-primary)" }}>
                How it works
              </h3>
              <ol style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                <li style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                  <span className="badge badge-neutral" style={{ flexShrink: 0 }}>1</span>
                  <span>Upload your bank statements (PDF) — we extract every transaction automatically.</span>
                </li>
                <li style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                  <span className="badge badge-neutral" style={{ flexShrink: 0 }}>2</span>
                  <span>Review the AI&apos;s categorization and correct any mislabeled items.</span>
                </li>
                <li style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                  <span className="badge badge-neutral" style={{ flexShrink: 0 }}>3</span>
                  <span>See your spending clearly — track habits, spot lifestyle creep, stay grounded.</span>
                </li>
              </ol>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ marginBottom: "var(--space-6)" }}>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "var(--space-2)" }}>
                Choose your categories
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                Select the spending categories that apply to your life. You can always add or remove them later.
              </p>
            </div>

            <div style={{ marginBottom: "var(--space-3)" }}>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-3)" }}>
                Expenses
              </p>
              <div className="category-selector">
                {DEFAULT_CATEGORIES.filter((c) => c.type === "expense").map((cat) => (
                  <button
                    key={cat.name}
                    className={`category-option ${selectedCategories.includes(cat.name) ? "selected" : ""}`}
                    onClick={() => toggleCategory(cat.name)}
                    type="button"
                  >
                    <div className="check-icon">
                      {selectedCategories.includes(cat.name) && <Check size={12} style={{ color: "var(--text-inverse)" }} />}
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "var(--space-5)" }}>
              <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-3)" }}>
                Income
              </p>
              <div className="category-selector">
                {DEFAULT_CATEGORIES.filter((c) => c.type === "income").map((cat) => (
                  <button
                    key={cat.name}
                    className={`category-option ${selectedCategories.includes(cat.name) ? "selected" : ""}`}
                    onClick={() => toggleCategory(cat.name)}
                    type="button"
                  >
                    <div className="check-icon">
                      {selectedCategories.includes(cat.name) && <Check size={12} style={{ color: "var(--text-inverse)" }} />}
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: "var(--space-6)" }}>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "var(--space-2)" }}>
                Select your currency
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                All amounts will be displayed in this currency.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {CURRENCIES.map((cur) => (
                <button
                  key={cur.code}
                  className={`category-option ${currency === cur.code ? "selected" : ""}`}
                  onClick={() => setCurrency(cur.code)}
                  type="button"
                  style={{ justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div className="check-icon">
                      {currency === cur.code && <Check size={12} style={{ color: "var(--text-inverse)" }} />}
                    </div>
                    <span style={{ fontWeight: 500 }}>{cur.name}</span>
                  </div>
                  <span className="mono" style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                    {cur.code} ({cur.symbol})
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div style={{
          display: "flex", gap: "var(--space-3)", marginTop: "var(--space-8)",
          justifyContent: step === 0 ? "center" : "space-between",
        }}>
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)} id="btn-back">
              Back
            </button>
          )}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleNext}
            id="btn-next"
            style={{ flex: step > 0 ? 1 : undefined, minWidth: step === 0 ? 200 : undefined }}
          >
            {step === STEPS.length - 1 ? "Start Tracking" : step === 0 ? "Get Started" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
