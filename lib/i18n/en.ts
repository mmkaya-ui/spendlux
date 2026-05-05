export const en = {
  // Navigation
  dashboard: "Dashboard",
  upload: "Upload",
  audit: "Audit",
  settings: "Settings",
  signOut: "Sign Out",

  // Common
  save: "Save",
  cancel: "Cancel",
  continue: "Continue",
  back: "Back",
  getStarted: "Get Started",
  startTracking: "Start Tracking",

  // Dashboard
  financialOverview: "Your financial overview for this month",
  totalInflow: "Total Inflow",
  totalOutflow: "Total Outflow",
  trueBalance: "True Balance",
  thisMonth: "This month",
  vsLastMonth: "vs last month",
  netThisMonth: "Net this month",
  monthlyTrends: "Monthly Trends",
  spendingByCategory: "Spending by Category",
  categoryBreakdown: "Category Breakdown",
  transactions: "Transactions",
  
  // Upload
  uploadStatements: "Upload Statements",
  uploadDesc: "Drop your bank statements or credit card exports here. We support PDF files up to 12 months retroactively.",
  dropHere: "Drop your files here",
  dragDrop: "Drag & drop PDF statements",
  browseFiles: "Browse Files",
  processingQueue: "Processing Queue",
  reviewAudit: "Review in Audit",
  privacyNotice: "Your privacy matters. Uploaded PDFs are processed in a secure environment and automatically purged after transaction data is extracted.",

  // Audit
  auditTitle: "Audit Transactions",
  auditDesc: "Review AI categorizations before committing to your ledger.",
  pending: "pending",
  approve: "Approve",
  reject: "Reject",
  nothingPermanent: "Nothing is permanent until you approve.",
  date: "Date",
  description: "Description",
  category: "Category",
  confidence: "Confidence",
  amount: "Amount",
  status: "Status",
  commit: "Commit",

  // AI Insights
  aiReview: "AI Financial Review",
  aiReviewDesc: "Run an advanced analysis on this month's spending to find optimization potentials and classify your fixed vs. variable costs.",
  generateInsights: "Generate Insights",
  analyzing: "Analyzing transaction patterns...",
  optimizations: "Optimization Potentials",
  anomalies: "Anomalies Detected",
  fixedVsVariable: "Fixed vs. Variable Ratio",
  fixed: "Fixed",
  variable: "Variable",
  saveMo: "Save",

  // Settings
  profile: "Profile",
  displayName: "Display Name",
  email: "Email",
  preferences: "Preferences",
  language: "Language",
  currency: "Base Currency",
  pushNotifications: "Push Notifications",
  security: "Security",
  dangerZone: "Danger Zone",
};

export type Dictionary = typeof en;
