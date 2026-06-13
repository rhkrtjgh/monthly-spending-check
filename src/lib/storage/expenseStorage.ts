import { createId } from "../createId";
import type { ExpenseItem } from "../../types/expense";
import { ensureExpenseRegDates } from "../expense/ensureExpenseRegDates";
import { STORAGE_KEYS } from "./constants";

function ensureExpenseIds(items: ExpenseItem[]): ExpenseItem[] {
  return items.map((item) => ({
    ...item,
    id: item.id ?? createId(),
  }));
}

function normalizeExpenses(items: ExpenseItem[]): ExpenseItem[] {
  return ensureExpenseIds(ensureExpenseRegDates(items));
}

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
  return normalizeExpenses(readExpensesRaw());
}

function writeExpenses(expenses: ExpenseItem[]) {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export function getExpenses(): ExpenseItem[] {
  const raw = readExpensesRaw();
  const normalized = normalizeExpenses(raw);

  const needsPersist = raw.some((item, index) => {
    const next = normalized[index];
    return (
      item.reg_date !== next?.reg_date ||
      item.id !== next?.id
    );
  });
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
      id: item.id ?? createId(),
      reg_date: item.reg_date ?? new Date().toISOString(),
    },
  ]);
}

export function updateExpense(item: ExpenseItem) {
  if (!item.id) {
    throw new Error("수정할 항목 ID가 없습니다.");
  }

  const expenses = readExpenses();
  const index = expenses.findIndex((expense) => expense.id === item.id);
  if (index === -1) {
    throw new Error("수정할 항목을 찾을 수 없습니다.");
  }

  const nextExpenses = [...expenses];
  nextExpenses[index] = {
    ...item,
    id: item.id,
    reg_date: expenses[index].reg_date ?? item.reg_date,
  };
  writeExpenses(nextExpenses);
}

export function deleteExpenses(ids: string[]) {
  if (ids.length === 0) {
    return;
  }

  const idSet = new Set(ids);
  const expenses = readExpenses().filter(
    (expense) => expense.id && !idSet.has(expense.id),
  );
  writeExpenses(expenses);
}

export function hasExpenses(): boolean {
  return readExpenses().length > 0;
}

export function setExpenses(expenses: ExpenseItem[]) {
  writeExpenses(normalizeExpenses(expenses));
}

export function clearExpenses() {
  writeExpenses([]);
}
