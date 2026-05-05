import { Category, Transaction } from "./types";

// Demo categories
export const DEMO_CATEGORIES: Category[] = [
  { id: "cat_housing", name: "Housing", type: "expense", color: "#6b8fb5", icon: "Home", sortOrder: 0 },
  { id: "cat_utilities", name: "Utilities", type: "expense", color: "#8b7bb5", icon: "Zap", sortOrder: 1 },
  { id: "cat_groceries", name: "Groceries", type: "expense", color: "#6b8f71", icon: "ShoppingCart", sortOrder: 2 },
  { id: "cat_transport", name: "Transport", type: "expense", color: "#b5916b", icon: "Car", sortOrder: 3 },
  { id: "cat_dining", name: "Dining Out", type: "expense", color: "#c17767", icon: "UtensilsCrossed", sortOrder: 4 },
  { id: "cat_health", name: "Healthcare", type: "expense", color: "#b56b6b", icon: "Heart", sortOrder: 5 },
  { id: "cat_subs", name: "Subscriptions", type: "expense", color: "#9a7bb5", icon: "Repeat", sortOrder: 6 },
  { id: "cat_discretionary", name: "Discretionary", type: "expense", color: "#d4a76a", icon: "Sparkles", sortOrder: 7 },
  { id: "cat_salary", name: "Salary", type: "income", color: "#6b8f71", icon: "Banknote", sortOrder: 8 },
  { id: "cat_freelance", name: "Freelance", type: "income", color: "#8fb56b", icon: "Briefcase", sortOrder: 9 },
];

// Generate realistic demo transactions for the current month
function generateDemoTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const txns: Transaction[] = [
    // Salary
    { id: "tx_001", amount: 520000, date: new Date(year, month, 1).toISOString(), categoryId: "cat_salary", categoryName: "Salary", description: "Monthly Salary - Acme Corp", merchant: "Acme Corp", type: "income", source: "pdf_upload" },
    { id: "tx_002", amount: 85000, date: new Date(year, month, 12).toISOString(), categoryId: "cat_freelance", categoryName: "Freelance", description: "Web design project", merchant: "ClientCo", type: "income", source: "pdf_upload" },
    // Housing
    { id: "tx_003", amount: -175000, date: new Date(year, month, 1).toISOString(), categoryId: "cat_housing", categoryName: "Housing", description: "Monthly Rent", merchant: "Landlord LLC", type: "expense", source: "pdf_upload" },
    // Utilities
    { id: "tx_004", amount: -12500, date: new Date(year, month, 5).toISOString(), categoryId: "cat_utilities", categoryName: "Utilities", description: "Electric Bill", merchant: "City Power Co", type: "expense", source: "pdf_upload" },
    { id: "tx_005", amount: -8900, date: new Date(year, month, 5).toISOString(), categoryId: "cat_utilities", categoryName: "Utilities", description: "Internet Service", merchant: "FiberNet ISP", type: "expense", source: "pdf_upload" },
    { id: "tx_006", amount: -6500, date: new Date(year, month, 8).toISOString(), categoryId: "cat_utilities", categoryName: "Utilities", description: "Water Bill", merchant: "Municipal Water", type: "expense", source: "pdf_upload" },
    // Groceries
    { id: "tx_007", amount: -8750, date: new Date(year, month, 2).toISOString(), categoryId: "cat_groceries", categoryName: "Groceries", description: "Weekly groceries", merchant: "Whole Foods", type: "expense", source: "pdf_upload" },
    { id: "tx_008", amount: -6200, date: new Date(year, month, 9).toISOString(), categoryId: "cat_groceries", categoryName: "Groceries", description: "Groceries", merchant: "Trader Joe's", type: "expense", source: "pdf_upload" },
    { id: "tx_009", amount: -4350, date: new Date(year, month, 16).toISOString(), categoryId: "cat_groceries", categoryName: "Groceries", description: "Fresh produce", merchant: "Local Market", type: "expense", source: "pdf_upload" },
    { id: "tx_010", amount: -9100, date: new Date(year, month, 23).toISOString(), categoryId: "cat_groceries", categoryName: "Groceries", description: "Weekly shopping", merchant: "Costco", type: "expense", source: "pdf_upload" },
    // Transport
    { id: "tx_011", amount: -5500, date: new Date(year, month, 3).toISOString(), categoryId: "cat_transport", categoryName: "Transport", description: "Gas station", merchant: "Shell", type: "expense", source: "pdf_upload" },
    { id: "tx_012", amount: -3200, date: new Date(year, month, 14).toISOString(), categoryId: "cat_transport", categoryName: "Transport", description: "Uber ride", merchant: "Uber", type: "expense", source: "pdf_upload" },
    // Dining
    { id: "tx_013", amount: -4500, date: new Date(year, month, 4).toISOString(), categoryId: "cat_dining", categoryName: "Dining Out", description: "Dinner", merchant: "Olive Garden", type: "expense", source: "pdf_upload" },
    { id: "tx_014", amount: -2800, date: new Date(year, month, 11).toISOString(), categoryId: "cat_dining", categoryName: "Dining Out", description: "Lunch with colleagues", merchant: "Panera Bread", type: "expense", source: "pdf_upload" },
    { id: "tx_015", amount: -6700, date: new Date(year, month, 18).toISOString(), categoryId: "cat_dining", categoryName: "Dining Out", description: "Birthday dinner", merchant: "Steakhouse", type: "expense", source: "pdf_upload" },
    // Healthcare
    { id: "tx_016", amount: -3500, date: new Date(year, month, 7).toISOString(), categoryId: "cat_health", categoryName: "Healthcare", description: "Pharmacy", merchant: "CVS Pharmacy", type: "expense", source: "pdf_upload" },
    // Subscriptions
    { id: "tx_017", amount: -1599, date: new Date(year, month, 1).toISOString(), categoryId: "cat_subs", categoryName: "Subscriptions", description: "Netflix", merchant: "Netflix", type: "expense", source: "pdf_upload" },
    { id: "tx_018", amount: -1099, date: new Date(year, month, 1).toISOString(), categoryId: "cat_subs", categoryName: "Subscriptions", description: "Spotify", merchant: "Spotify", type: "expense", source: "pdf_upload" },
    { id: "tx_019", amount: -999, date: new Date(year, month, 15).toISOString(), categoryId: "cat_subs", categoryName: "Subscriptions", description: "iCloud Storage", merchant: "Apple", type: "expense", source: "pdf_upload" },
    // Discretionary
    { id: "tx_020", amount: -12900, date: new Date(year, month, 10).toISOString(), categoryId: "cat_discretionary", categoryName: "Discretionary", description: "New headphones", merchant: "Amazon", type: "expense", source: "pdf_upload" },
    { id: "tx_021", amount: -4500, date: new Date(year, month, 20).toISOString(), categoryId: "cat_discretionary", categoryName: "Discretionary", description: "Book order", merchant: "Barnes & Noble", type: "expense", source: "pdf_upload" },
  ];

  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const DEMO_TRANSACTIONS = generateDemoTransactions();

// Monthly trend data (last 6 months) — total outflow in cents
export const DEMO_MONTHLY_TRENDS = (() => {
  const months: { month: string; outflow: number; inflow: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const baseOut = 280000 + Math.floor(Math.random() * 60000);
    const baseIn = 550000 + Math.floor(Math.random() * 100000);
    months.push({ month: label, outflow: baseOut, inflow: baseIn });
  }
  return months;
})();

// Category spending breakdown for current month
export function getCategoryBreakdown(transactions: Transaction[]) {
  const map: Record<string, { categoryId: string; categoryName: string; color: string; total: number; count: number }> = {};
  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    if (!map[tx.categoryId]) {
      const cat = DEMO_CATEGORIES.find((c) => c.id === tx.categoryId);
      map[tx.categoryId] = {
        categoryId: tx.categoryId,
        categoryName: tx.categoryName,
        color: cat?.color || "#666",
        total: 0,
        count: 0,
      };
    }
    map[tx.categoryId].total += Math.abs(tx.amount);
    map[tx.categoryId].count += 1;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}
