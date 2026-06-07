export const EXPENSE_CATEGORY = {
  LIVING: "생활 고정비",
  SUBSCRIPTION: "구독 서비스",
} as const;

export type ExpenseCategory =
  (typeof EXPENSE_CATEGORY)[keyof typeof EXPENSE_CATEGORY];

export const EXPENSE_FREQUENCY = {
  WEEK: "주",
  MONTH: "월",
  YEAR: "년",
} as const;

export type ExpenseFrequency =
  (typeof EXPENSE_FREQUENCY)[keyof typeof EXPENSE_FREQUENCY];

/** TS_MNA_EXP_INFO 컬럼과 동일 (userKey 제외) */
export interface ExpenseItem {
  category: ExpenseCategory;
  sub_category: string;
  amount: number;
  due_date?: number;
  frequency?: ExpenseFrequency;
}

export interface ExpenseFormDraft {
  category: ExpenseCategory | null;
  sub_category_group: string | null;
  sub_category: string;
  amount: string;
  due_date: string;
  frequency: ExpenseFrequency | null;
}
