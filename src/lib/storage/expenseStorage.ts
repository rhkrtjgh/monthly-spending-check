import type { ExpenseItem } from "../../types/expense";
import { ensureExpenseRegDates } from "../expense/ensureExpenseRegDates";
import { STORAGE_KEYS } from "./constants";

function readExpensesRaw(): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ExpenseItem[]) : [];
  } catch {
    return [];
  }
}

function readExpenses(): ExpenseItem[] {
  return ensureExpenseRegDates(readExpensesRaw());
}

function writeExpenses(expenses: ExpenseItem[]) {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export function getExpenses(): ExpenseItem[] {
  const raw = readExpensesRaw();
  const normalized = ensureExpenseRegDates(raw);

  const needsPersist = raw.some(
    (item, index) => item.reg_date !== normalized[index]?.reg_date,
  );
  if (needsPersist) {
    writeExpenses(normalized);
  }

  return normalized;
}

export function addExpense(item: ExpenseItem) {
  const expenses = readExpenses();
  writeExpenses([
    ...expenses,
    {
      ...item,
      reg_date: item.reg_date ?? new Date().toISOString(),
    },
  ]);
}

export function hasExpenses(): boolean {
  return readExpenses().length > 0;
}

export function setExpenses(expenses: ExpenseItem[]) {
  writeExpenses(expenses);
}

export function clearExpenses() {
  writeExpenses([]);
}
