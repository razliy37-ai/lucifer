import { Category, Transaction, PlatformNotification, PlatformSubscriber } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  // Income Categories
  { id: "cat-inc-sales", name: "Sales", type: "income", color: "emerald", isDefault: true },
  { id: "cat-inc-services", name: "Services", type: "income", color: "teal", isDefault: true },
  { id: "cat-inc-invest", name: "Investments", type: "income", color: "indigo", isDefault: true },
  
  // Expense Categories
  { id: "cat-exp-rent", name: "Rent", type: "expense", color: "rose", isDefault: true },
  { id: "cat-exp-util", name: "Utilities", type: "expense", color: "orange", isDefault: true },
  { id: "cat-exp-market", name: "Marketing", type: "expense", color: "blue", isDefault: true },
  { id: "cat-exp-salary", name: "Salaries", type: "expense", color: "violet", isDefault: true },
  { id: "cat-exp-inventory", name: "Inventory", type: "expense", color: "amber", isDefault: true },
  { id: "cat-exp-travel", name: "Travel", type: "expense", color: "cyan", isDefault: true },
  { id: "cat-exp-software", name: "Software", type: "expense", color: "pink", isDefault: true },
];

export const PRE_POPULATED_TRANSACTIONS: Transaction[] = [
  // Previous Month (May 2026)
  { id: "t1", amount: 12500, date: "2026-05-02", type: "income", categoryId: "cat-inc-sales", description: "Direct product store sales" },
  { id: "t2", amount: 3200, date: "2025-05-05", type: "income", categoryId: "cat-inc-services", description: "SME Consulting Retainer" },
  { id: "t3", amount: 1500, date: "2026-05-10", type: "expense", categoryId: "cat-exp-rent", description: "Main street retail space lease" },
  { id: "t4", amount: 450, date: "2026-05-11", type: "expense", categoryId: "cat-exp-util", description: "Electricity & Fiber Internet" },
  { id: "t5", amount: 1200, date: "2026-05-15", type: "expense", categoryId: "cat-exp-market", description: "Google Search Ads & Social media campaigns" },
  { id: "t6", amount: 4500, date: "2026-05-20", type: "expense", categoryId: "cat-exp-salary", description: "Staff Payroll - 2 full-time specialists" },
  { id: "t7", amount: 2800, date: "2026-05-25", type: "expense", categoryId: "cat-exp-inventory", description: "Restocked bestseller accessories" },
  { id: "t8", amount: 300, date: "2026-05-28", type: "expense", categoryId: "cat-exp-software", description: "FinTrack Premium Subscription, GSuite & Figma" },
  
  // Current Month (June 2026)
  { id: "t9", amount: 15400, date: "2026-06-01", type: "income", categoryId: "cat-inc-sales", description: "Launch week sales" },
  { id: "t10", amount: 4800, date: "2026-06-02", type: "income", categoryId: "cat-inc-services", description: "Client custom system design retainer" },
  { id: "t11", amount: 1500, date: "2026-06-02", type: "expense", categoryId: "cat-exp-rent", description: "Main street retail space lease" },
  { id: "t12", amount: 420, date: "2026-06-03", type: "expense", categoryId: "cat-exp-util", description: "Electricity bill & utilities" },
  { id: "t13", amount: 1800, date: "2026-06-03", type: "expense", categoryId: "cat-exp-market", description: "Influencer marketing partnership campaign" },
  { id: "t14", amount: 4500, date: "2026-06-03", type: "expense", categoryId: "cat-exp-salary", description: "June Staff Payroll" },
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: "n1",
    title: "Monthly Business Report Available",
    message: "Your financial report for May 2026 is fully compiled. You registered a healthy net profit on top of a 12.5% sales increase.",
    type: "summary",
    date: "2026-06-01T08:00:00.000Z",
    read: false,
  },
  {
    id: "n2",
    title: "Utility Expense Reminder",
    message: "Your monthly Internet and Utilities bill is due in 3 days. We've budgeted an estimate of $450.",
    type: "reminder",
    date: "2026-06-02T10:30:00.000Z",
    read: false,
  },
  {
    id: "n3",
    title: "Alert: High Spending in Marketing",
    message: "Marketing expenses increased by 15% ($1,800) compared to last month. Run an ROI audit on active channels.",
    type: "alert",
    date: "2026-06-03T14:15:00.000Z",
    read: false,
  },
];

export const MOCK_ADMIN_SUBSCRIBERS: PlatformSubscriber[] = [
  { id: "sub1", businessName: "Acme Agency Ltd", email: "contact@acmeagency.io", plan: "premium", startDate: "2026-01-15", monthlyRevenue: 15400, status: "active" },
  { id: "sub2", businessName: "Daily Bread Cafe", email: "cafe@dailybread.com", plan: "premium", startDate: "2026-02-10", monthlyRevenue: 9800, status: "active" },
  { id: "sub3", businessName: "Aura Creative Studio", email: "hello@auracreative.space", plan: "free", startDate: "2026-03-01", monthlyRevenue: 3400, status: "active" },
  { id: "sub4", businessName: "Summit Apparel Retail", email: "shop@summitapparel.com", plan: "premium", startDate: "2026-04-05", monthlyRevenue: 28900, status: "active" },
  { id: "sub5", businessName: "E-Cart Global", email: "admin@ecartglobal.net", plan: "free", startDate: "2026-05-12", monthlyRevenue: 1250, status: "active" },
  { id: "sub6", businessName: "Lighthouse Lodging", email: "booking@lighthouselodging.org", plan: "premium", startDate: "2026-05-20", monthlyRevenue: 11000, status: "active" },
];
