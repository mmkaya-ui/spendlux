"use client";

import { useState, useMemo } from "react";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { formatCurrency, percentChange } from "@/lib/utils";
import {
  DEMO_TRANSACTIONS,
  DEMO_MONTHLY_TRENDS,
  getCategoryBreakdown,
} from "@/lib/demo-data";
import AiInsights from "@/components/AiInsights";

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const transactions = DEMO_TRANSACTIONS;
  const trends = DEMO_MONTHLY_TRENDS;

  // Calculate totals
  const totalInflow = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalOutflow = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0),
    [transactions]
  );
  const trueBalance = totalInflow - totalOutflow;

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(transactions),
    [transactions]
  );

  const maxCategorySpend = categoryBreakdown[0]?.total || 1;

  // Month-over-month change
  const currentMonthOutflow = trends[trends.length - 1]?.outflow || 0;
  const prevMonthOutflow = trends[trends.length - 2]?.outflow || 0;
  const monthChange = percentChange(currentMonthOutflow, prevMonthOutflow);

  // Chart data formatted for Recharts
  const trendData = trends.map((t) => ({
    month: t.month,
    Outflow: t.outflow / 100,
    Inflow: t.inflow / 100,
  }));

  // Category drill-down
  const filteredTxns = selectedCategory
    ? transactions.filter((t) => t.categoryId === selectedCategory)
    : null;

  // Custom tooltip for charts
  const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
    if (!active || !payload) return null;
    return (
      <div style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)",
        fontSize: "var(--text-xs)",
      }}>
        <p style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.dataKey}: ${p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your financial overview for this month</p>
      </div>

      {/* Stat Cards */}
      <div className="card-grid card-grid-3" style={{ marginBottom: "var(--space-8)" }}>
        {/* Inflow */}
        <div className="stat-card glass glass-hover" id="stat-inflow">
          <div className="stat-label">
            <TrendingUp size={16} style={{ color: "var(--positive)" }} />
            Total Inflow
          </div>
          <div className="stat-value text-positive">
            {formatCurrency(totalInflow)}
          </div>
          <div className="stat-change text-positive">
            <ArrowUpRight size={12} /> This month
          </div>
        </div>

        {/* Outflow */}
        <div className="stat-card glass glass-hover" id="stat-outflow">
          <div className="stat-label">
            <TrendingDown size={16} style={{ color: "var(--negative)" }} />
            Total Outflow
          </div>
          <div className="stat-value text-negative">
            {formatCurrency(totalOutflow)}
          </div>
          <div className="stat-change" style={{ color: monthChange > 0 ? "var(--negative)" : "var(--positive)" }}>
            {monthChange > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(monthChange)}% vs last month
          </div>
        </div>

        {/* True Balance */}
        <div className="stat-card glass glass-hover" id="stat-balance">
          <div className="stat-label">
            <Wallet size={16} style={{ color: "var(--accent)" }} />
            True Balance
          </div>
          <div className={`stat-value ${trueBalance >= 0 ? "text-positive" : "text-negative"}`}>
            {formatCurrency(trueBalance)}
          </div>
          <div className="stat-change text-accent">
            Net this month
          </div>
        </div>
      </div>

      {/* AI Insights Engine */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <AiInsights transactions={transactions} />
      </div>

      {/* Charts Row */}
      <div className="card-grid card-grid-2" style={{ marginBottom: "var(--space-8)" }}>
        {/* Trend Chart */}
        <div className="glass" style={{ padding: "var(--space-6)" }} id="chart-trends">
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--text-secondary)" }}>
            Monthly Trends
          </h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="Inflow" stroke="var(--positive)" strokeWidth={2} dot={{ r: 3, fill: "var(--positive)" }} />
                <Line type="monotone" dataKey="Outflow" stroke="var(--negative)" strokeWidth={2} dot={{ r: 3, fill: "var(--negative)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category Bar */}
        <div className="glass" style={{ padding: "var(--space-6)" }} id="chart-categories">
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--text-secondary)" }}>
            Spending by Category
          </h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown.map((c) => ({ name: c.categoryName, amount: c.total / 100, fill: c.color }))}>
                <XAxis dataKey="name" tick={{ fill: "var(--text-tertiary)", fontSize: 10 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {categoryBreakdown.map((c, i) => (
                    <Bar key={i} dataKey="amount" fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="glass" style={{ padding: "var(--space-6)", marginBottom: "var(--space-8)" }} id="category-breakdown">
        <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--text-secondary)" }}>
          Category Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {categoryBreakdown.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => setSelectedCategory(selectedCategory === cat.categoryId ? null : cat.categoryId)}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-4)",
                padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)",
                background: selectedCategory === cat.categoryId ? "var(--bg-glass-hover)" : "transparent",
                border: "none", cursor: "pointer", width: "100%", textAlign: "left",
                transition: "background var(--duration-fast) var(--ease-out)",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: "var(--text-sm)", fontWeight: 500 }}>{cat.categoryName}</span>
              <span className="badge badge-neutral">{cat.count} txn{cat.count !== 1 ? "s" : ""}</span>
              <span className="mono" style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--negative)", minWidth: 80, textAlign: "right" }}>
                {formatCurrency(cat.total)}
              </span>
              {/* Progress bar */}
              <div style={{ width: 80, flexShrink: 0 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(cat.total / maxCategorySpend) * 100}%`, background: cat.color }} />
                </div>
              </div>
              <ChevronRight size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0, transform: selectedCategory === cat.categoryId ? "rotate(90deg)" : "none", transition: "transform var(--duration-fast)" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Drill-down: transactions for selected category */}
      {filteredTxns && filteredTxns.length > 0 && (
        <div className="glass fade-in" style={{ padding: "var(--space-6)" }} id="category-drilldown">
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--text-secondary)" }}>
            {categoryBreakdown.find((c) => c.categoryId === selectedCategory)?.categoryName} — Transactions
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Merchant</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td>{tx.description}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{tx.merchant}</td>
                  <td className="amount-cell text-negative">{formatCurrency(Math.abs(tx.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
