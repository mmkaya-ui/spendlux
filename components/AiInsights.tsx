"use client";

import { useState, useEffect } from "react";
import { Sparkles, AlertTriangle, TrendingDown, PieChart, Loader2 } from "lucide-react";
import { generateFinancialInsights } from "@/app/actions/ai";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

interface AiInsightsProps {
  transactions: Transaction[];
}

export default function AiInsights({ transactions }: AiInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We only want to run this when the user explicitly asks for it to save costs,
  // or we could run it automatically. Let's make it an explicit action for mindful interaction.
  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const userApiKey = localStorage.getItem("spendlux-gemini-key") || undefined;
      const result = await generateFinancialInsights(transactions, userApiKey);
      if (result.error) {
        setError(result.error);
        // Load some demo data if the API keys aren't set up yet so the user can see what it looks like
        if (result.demoFallback) {
           setInsights({
             optimizations: [
               { title: "Cancel Unused Subscription", description: "You have been paying for 'Premium Fitness App' but no gym-related expenses suggest usage.", potentialSavingsCents: 1499 },
               { title: "Dining Out Frequency", description: "You ate out 8 times this month. Reducing this to 4 times could save significantly.", potentialSavingsCents: 8500 }
             ],
             anomalies: [
               { transactionId: "tx_020", reason: "Amazon purchase of $129.00 is 3x higher than your average discretionary spending." }
             ],
             fixedVariableBreakdown: {
               fixedTotalCents: 195000,
               variableTotalCents: 85000,
               reclassifications: []
             },
             detectedCurrency: "USD"
           });
        }
      } else {
        setInsights(result);
      }
    } catch (err) {
      setError("Failed to connect to AI engine.");
    } finally {
      setLoading(false);
    }
  };

  if (!insights && !loading) {
    return (
      <div className="glass" style={{ padding: "var(--space-6)", textAlign: "center" }}>
        <Sparkles size={24} style={{ color: "var(--accent)", margin: "0 auto var(--space-3)" }} />
        <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "var(--space-2)" }}>AI Financial Review</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
          Run an advanced analysis on this month&apos;s spending to find optimization potentials and classify your fixed vs. variable costs.
        </p>
        <button className="btn btn-secondary" onClick={fetchInsights}>
          Generate Insights
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
        <Loader2 size={32} className="pulse" style={{ color: "var(--accent)", marginBottom: "var(--space-4)" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>Analyzing transaction patterns...</p>
      </div>
    );
  }

  const pieData = [
    { name: "Fixed (Necessities)", value: insights.fixedVariableBreakdown.fixedTotalCents / 100, color: "var(--info)" },
    { name: "Variable (Discretionary)", value: insights.fixedVariableBreakdown.variableTotalCents / 100, color: "var(--warning)" }
  ];

  return (
    <div className="glass fade-in" style={{ padding: "var(--space-6)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Sparkles size={20} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>Vertex AI Insights</h3>
        </div>
        {insights?.detectedCurrency && (
          <span className="badge badge-neutral" style={{ fontSize: "var(--text-xs)" }}>
            Detected Currency: {insights.detectedCurrency}
          </span>
        )}
      </div>

      {error && !insights && (
        <div style={{ padding: "var(--space-3)", background: "var(--negative-muted)", color: "var(--negative)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
          {error}
        </div>
      )}

      <div className="card-grid card-grid-2">
        {/* Optimizations */}
        <div>
          <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <TrendingDown size={14} /> Optimization Potentials
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {insights.optimizations.map((opt: any, i: number) => (
              <div key={i} style={{ background: "var(--bg-surface)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
                  <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>{opt.title}</span>
                  <span className="text-positive" style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>
                    Save {formatCurrency(opt.potentialSavingsCents)}/mo
                  </span>
                </div>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{opt.description}</p>
              </div>
            ))}
          </div>

          {/* Anomalies */}
          <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginTop: "var(--space-5)", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <AlertTriangle size={14} /> Anomalies Detected
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {insights.anomalies.map((ano: any, i: number) => {
              const tx = transactions.find(t => t.id === ano.transactionId);
              return (
                <div key={i} style={{ background: "var(--warning-muted)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid rgba(212, 167, 106, 0.2)" }}>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--warning)", fontWeight: 500, marginBottom: "var(--space-1)" }}>
                    {tx ? `${tx.description} (${formatCurrency(Math.abs(tx.amount))})` : 'Unknown Transaction'}
                  </p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{ano.reason}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed vs Variable */}
        <div>
          <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <PieChart size={14} /> Fixed vs. Variable Ratio
          </h4>
          <div style={{ height: 200, background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}
                  itemStyle={{ fontSize: "var(--text-xs)" }}
                />
              </RechartsPie>
            </ResponsiveContainer>
            {/* Center Label */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <span style={{ display: "block", fontSize: "var(--text-lg)", fontWeight: 700 }}>
                {Math.round((insights.fixedVariableBreakdown.fixedTotalCents / (insights.fixedVariableBreakdown.fixedTotalCents + insights.fixedVariableBreakdown.variableTotalCents)) * 100)}%
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Fixed</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-4)", marginTop: "var(--space-3)" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)" }}>
               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--info)" }} /> Fixed
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)" }}>
               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warning)" }} /> Variable
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
