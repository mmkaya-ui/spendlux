"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Check,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PendingTransaction } from "@/lib/types";
import { DEMO_CATEGORIES } from "@/lib/demo-data";

// Generate demo pending transactions
const DEMO_PENDING: PendingTransaction[] = [
  { id: "ptx_1", amount: -8750, date: "2026-05-02T00:00:00Z", suggestedCategoryId: "cat_groceries", suggestedCategoryName: "Groceries", confidence: 0.95, description: "WHOLE FOODS MKT #10234", merchant: "Whole Foods", type: "expense", uploadBatchId: "batch_1", status: "pending" },
  { id: "ptx_2", amount: -4500, date: "2026-05-04T00:00:00Z", suggestedCategoryId: "cat_dining", suggestedCategoryName: "Dining Out", confidence: 0.88, description: "OLIVE GARDEN #5521", merchant: "Olive Garden", type: "expense", uploadBatchId: "batch_1", status: "pending" },
  { id: "ptx_3", amount: -175000, date: "2026-05-01T00:00:00Z", suggestedCategoryId: "cat_housing", suggestedCategoryName: "Housing", confidence: 0.98, description: "RENT PAYMENT - APT 4B", merchant: "Landlord LLC", type: "expense", uploadBatchId: "batch_1", status: "pending" },
  { id: "ptx_4", amount: -3200, date: "2026-05-14T00:00:00Z", suggestedCategoryId: "cat_transport", suggestedCategoryName: "Transport", confidence: 0.72, description: "UBER *TRIP-8834X", merchant: "Uber", type: "expense", uploadBatchId: "batch_1", status: "pending" },
  { id: "ptx_5", amount: -12900, date: "2026-05-10T00:00:00Z", suggestedCategoryId: "cat_discretionary", suggestedCategoryName: "Discretionary", confidence: 0.45, description: "AMZN MKTP US*2K83H1", merchant: "Amazon", type: "expense", uploadBatchId: "batch_1", status: "pending" },
  { id: "ptx_6", amount: 520000, date: "2026-05-01T00:00:00Z", suggestedCategoryId: "cat_salary", suggestedCategoryName: "Salary", confidence: 0.99, description: "ACME CORP PAYROLL", merchant: "Acme Corp", type: "income", uploadBatchId: "batch_1", status: "pending" },
  { id: "ptx_7", amount: -1599, date: "2026-05-01T00:00:00Z", suggestedCategoryId: "cat_subs", suggestedCategoryName: "Subscriptions", confidence: 0.97, description: "NETFLIX.COM", merchant: "Netflix", type: "expense", uploadBatchId: "batch_1", status: "pending" },
  { id: "ptx_8", amount: -6700, date: "2026-05-18T00:00:00Z", suggestedCategoryId: "cat_dining", suggestedCategoryName: "Dining Out", confidence: 0.62, description: "STEAKHOUSE GRILL & BAR", merchant: "Steakhouse", type: "expense", uploadBatchId: "batch_1", status: "pending" },
];

function ConfidenceBadge({ confidence }: { confidence: number }) {
  if (confidence >= 0.85) return <span className="badge badge-positive" title={`${Math.round(confidence * 100)}% confidence`}>High</span>;
  if (confidence >= 0.6) return <span className="badge badge-warning" title={`${Math.round(confidence * 100)}% confidence`}>Medium</span>;
  return <span className="badge badge-negative" title={`${Math.round(confidence * 100)}% confidence`}>Low</span>;
}

function CategoryDropdown({
  currentId,
  onChange,
}: {
  currentId: string;
  onChange: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = DEMO_CATEGORIES.find((c) => c.id === currentId);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className="category-pill"
        style={{ cursor: "pointer", gap: "var(--space-2)" }}
        type="button"
      >
        <div className="category-dot" style={{ background: current?.color || "#666" }} />
        <span>{current?.name || "Unknown"}</span>
        <ChevronDown size={12} style={{ color: "var(--text-tertiary)", transform: open ? "rotate(180deg)" : "none", transition: "transform var(--duration-fast)" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)", padding: "var(--space-2)",
          minWidth: 180, boxShadow: "var(--shadow-lg)",
        }}>
          {DEMO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onChange(cat.id, cat.name); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-3)", width: "100%",
                borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)",
                background: cat.id === currentId ? "var(--accent-muted)" : "transparent",
                border: "none", cursor: "pointer", color: "var(--text-primary)",
                transition: "background var(--duration-fast)",
              }}
              type="button"
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "var(--bg-overlay)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = cat.id === currentId ? "var(--accent-muted)" : "transparent"; }}
            >
              <div className="category-dot" style={{ background: cat.color }} />
              <span>{cat.name}</span>
              {cat.id === currentId && <Check size={12} style={{ marginLeft: "auto", color: "var(--accent)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuditPage() {
  const [transactions, setTransactions] = useState(DEMO_PENDING);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const pendingCount = useMemo(
    () => transactions.filter((t) => t.status === "pending").length,
    [transactions]
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
    } else {
      setSelected(new Set(transactions.filter((t) => t.status === "pending").map((t) => t.id)));
    }
    setSelectAll(!selectAll);
  };

  const approveSelected = () => {
    setTransactions((prev) =>
      prev.map((t) => (selected.has(t.id) ? { ...t, status: "approved" as const } : t))
    );
    setSelected(new Set());
    setSelectAll(false);
  };

  const rejectSelected = () => {
    setTransactions((prev) =>
      prev.map((t) => (selected.has(t.id) ? { ...t, status: "rejected" as const } : t))
    );
    setSelected(new Set());
    setSelectAll(false);
  };

  const changeCategory = (txId: string, catId: string, catName: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId ? { ...t, suggestedCategoryId: catId, suggestedCategoryName: catName } : t
      )
    );
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <div>
            <h1>Audit Transactions</h1>
            <p>Review AI categorizations before committing to your ledger. {pendingCount} pending.</p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            {selected.size > 0 && (
              <>
                <button className="btn btn-danger" onClick={rejectSelected} id="btn-reject">
                  <XCircle size={14} /> Reject ({selected.size})
                </button>
                <button className="btn btn-primary" onClick={approveSelected} id="btn-approve">
                  <CheckCircle2 size={14} /> Approve ({selected.size})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Audit notice */}
      <div style={{
        padding: "var(--space-3) var(--space-5)", background: "var(--warning-muted)",
        borderRadius: "var(--radius-md)", border: "1px solid rgba(212, 167, 106, 0.15)",
        fontSize: "var(--text-xs)", color: "var(--warning)",
        display: "flex", alignItems: "center", gap: "var(--space-3)",
        marginBottom: "var(--space-6)",
      }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Nothing is permanent until you approve.</strong> Review each category assignment. Click the category pill to change it.
          Low-confidence items are flagged — pay special attention to those.
        </span>
      </div>

      {/* Transaction table */}
      <div className="glass" style={{ overflow: "auto" }} id="audit-table">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  style={{ accentColor: "var(--accent)" }}
                  aria-label="Select all"
                />
              </th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Confidence</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ opacity: tx.status !== "pending" ? 0.5 : 1 }}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(tx.id)}
                    onChange={() => toggleSelect(tx.id)}
                    disabled={tx.status !== "pending"}
                    style={{ accentColor: "var(--accent)" }}
                    aria-label={`Select ${tx.description}`}
                  />
                </td>
                <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                  {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td>
                  <div>
                    <div style={{ fontWeight: 500 }}>{tx.description}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{tx.merchant}</div>
                  </div>
                </td>
                <td>
                  <CategoryDropdown
                    currentId={tx.suggestedCategoryId}
                    onChange={(catId, catName) => changeCategory(tx.id, catId, catName)}
                  />
                </td>
                <td>
                  <ConfidenceBadge confidence={tx.confidence} />
                </td>
                <td className={`amount-cell ${tx.type === "income" ? "text-positive" : "text-negative"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(Math.abs(tx.amount))}
                </td>
                <td>
                  {tx.status === "approved" && <span className="badge badge-positive"><Check size={10} /> Approved</span>}
                  {tx.status === "rejected" && <span className="badge badge-negative"><XCircle size={10} /> Rejected</span>}
                  {tx.status === "pending" && <span className="badge badge-neutral">Pending</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Commit button */}
      {transactions.some((t) => t.status === "approved") && (
        <div style={{ marginTop: "var(--space-6)", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary btn-lg" id="btn-commit">
            Commit {transactions.filter((t) => t.status === "approved").length} transactions to ledger
          </button>
        </div>
      )}
    </div>
  );
}
