export type UserRole = "user" | "administrator";
export type SubscriptionType = "free" | "premium";
export type TransactionType = "income" | "expense";
export type NotificationType = "reminder" | "summary" | "alert";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscription: SubscriptionType;
  businessId: string;
}

export interface Business {
  id: string;
  name: string;
  industry: string;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string; // Tailwind color class
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  categoryId: string;
  description: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string; // ISO string
  read: boolean;
}

export interface PlatformSubscriber {
  id: string;
  businessName: string;
  email: string;
  plan: SubscriptionType;
  startDate: string;
  monthlyRevenue: number;
  status: "active" | "cancelled" | "expired";
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashBalance: number;
}
