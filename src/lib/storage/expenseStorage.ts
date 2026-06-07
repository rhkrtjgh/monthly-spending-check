import type { ExpenseItem } from "../../types/expense";
import { STORAGE_KEYS } from "./constants";

function readExpenses(): ExpenseItem[] {
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

function writeExpenses(expenses: ExpenseItem[]) {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export function getExpenses(): ExpenseItem[] {
  return readExpenses();
}

export function addExpense(item: ExpenseItem) {
  const expenses = readExpenses();
  writeExpenses([...expenses, item]);
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
