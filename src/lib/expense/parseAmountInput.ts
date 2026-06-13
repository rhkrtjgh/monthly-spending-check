import type { ExpenseFrequency } from "../../types/expense";
import { EXPENSE_FREQUENCY } from "../../types/expense";

export const MAX_EXPENSE_AMOUNT_DEFAULT = 100_000_000;
export const MAX_EXPENSE_AMOUNT_YEAR = 1_000_000_000;

export function getMaxExpenseAmount(
  frequency: ExpenseFrequency | null,
): number {
  if (frequency === EXPENSE_FREQUENCY.YEAR) {
    return MAX_EXPENSE_AMOUNT_YEAR;
  }

  return MAX_EXPENSE_AMOUNT_DEFAULT;
}

export function parseAmountInput(
  value: string,
  frequency: ExpenseFrequency | null,
): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }

  const amount = Number.parseInt(digits, 10);
  if (!Number.isFinite(amount) || amount <= 0) {
    return "";
  }

  return String(Math.min(amount, getMaxExpenseAmount(frequency)));
}

export function parseAmountValue(
  value: string,
  frequency: ExpenseFrequency | null,
): number | null {
  const digits = value.replace(/,/g, "").replace(/[^\d]/g, "");
  if (!digits) {
    return null;
  }

  const amount = Number.parseInt(digits, 10);
  const maxAmount = getMaxExpenseAmount(frequency);
  if (!Number.isFinite(amount) || amount <= 0 || amount > maxAmount) {
    return null;
  }

  return amount;
}
