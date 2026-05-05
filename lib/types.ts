export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  sortOrder: number;
}

export interface Transaction {
  id: string;
  amount: number; // cents (integer)
  date: string; // ISO string
  categoryId: string;
  categoryName: string; // denormalized
  description: string;
  merchant: string;
  type: "income" | "expense";
  source: "pdf_upload" | "manual";
  uploadBatchId?: string;
}

export interface PendingTransaction {
  id: string;
  amount: number; // cents
  date: string;
  suggestedCategoryId: string;
  suggestedCategoryName: string;
  confidence: number; // 0-1
  description: string;
  merchant: string;
  type: "income" | "expense";
  uploadBatchId: string;
  status: "pending" | "approved" | "rejected";
}

export interface Budget {
  yearMonth: string; // "2026-05"
  allocations: Record<string, number>; // categoryId -> cents
  totalLimit: number; // cents
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  currency: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface UploadJob {
  id: string;
  fileName: string;
  fileSize: number;
  status: "idle" | "uploading" | "extracting" | "categorizing" | "ready" | "committed" | "error";
  progress: number; // 0-100
  error?: string;
  transactionCount?: number;
}

// Default categories for onboarding
export const DEFAULT_CATEGORIES: Omit<Category, "id" | "sortOrder">[] = [
  { name: "Housing", type: "expense", color: "#6b8fb5", icon: "Home" },
  { name: "Utilities", type: "expense", color: "#8b7bb5", icon: "Zap" },
  { name: "Groceries", type: "expense", color: "#6b8f71", icon: "ShoppingCart" },
  { name: "Transport", type: "expense", color: "#b5916b", icon: "Car" },
  { name: "Dining Out", type: "expense", color: "#c17767", icon: "UtensilsCrossed" },
  { name: "Healthcare", type: "expense", color: "#b56b6b", icon: "Heart" },
  { name: "Insurance", type: "expense", color: "#7b8b9a", icon: "Shield" },
  { name: "Subscriptions", type: "expense", color: "#9a7bb5", icon: "Repeat" },
  { name: "Discretionary", type: "expense", color: "#d4a76a", icon: "Sparkles" },
  { name: "Savings", type: "expense", color: "#6b9a8f", icon: "PiggyBank" },
  { name: "Salary", type: "income", color: "#6b8f71", icon: "Banknote" },
  { name: "Freelance", type: "income", color: "#8fb56b", icon: "Briefcase" },
  { name: "Other Income", type: "income", color: "#b5a86b", icon: "Plus" },
];
