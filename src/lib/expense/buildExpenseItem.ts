import {
  EXPENSE_FREQUENCY,
  type ExpenseFormDraft,
  type ExpenseItem,
} from "../../types/expense";
import { convertToMonthlyAmount } from "./convertToMonthlyAmount";
import { parseAmountValue } from "./parseAmountInput";

function formatStoredSubCategory(draft: ExpenseFormDraft): string {
  const itemName = draft.sub_category.trim();
  if (draft.sub_category_group) {
    return `${draft.sub_category_group} · ${itemName}`;
  }
  return itemName;
}

export function parseStoredSubCategory(subCategory: string) {
  const parts = subCategory.split(" · ");
  if (parts.length >= 2) {
    return {
      group: parts[0],
      name: parts.slice(1).join(" · "),
    };
  }

  return {
    group: null,
    name: subCategory,
  };
}

export function expenseItemToFormDraft(item: ExpenseItem): ExpenseFormDraft {
  const { group, name } = parseStoredSubCategory(item.sub_category);

  return {
    category: item.category,
    sub_category_group: group,
    sub_category: name,
    amount: String(item.amount),
    due_date: item.due_date != null ? String(item.due_date) : "",
    frequency: item.frequency ?? EXPENSE_FREQUENCY.MONTH,
  };
}

export function buildExpenseItemFromDraft(
  draft: ExpenseFormDraft,
  existing?: Pick<ExpenseItem, "id" | "reg_date">,
): ExpenseItem | null {
  if (
    !draft.category ||
    !draft.sub_category_group ||
    !draft.sub_category.trim()
  ) {
    return null;
  }

  const amount = parseAmountValue(draft.amount, draft.frequency);
  if (amount === null || !draft.frequency) {
    return null;
  }

  const monthlyAmount = convertToMonthlyAmount(amount, draft.frequency);

  const item: ExpenseItem = {
    id: existing?.id ?? crypto.randomUUID(),
    category: draft.category,
    sub_category: formatStoredSubCategory(draft),
    amount: monthlyAmount,
    frequency: EXPENSE_FREQUENCY.MONTH,
    reg_date: existing?.reg_date ?? new Date().toISOString(),
  };

  if (
    draft.frequency === EXPENSE_FREQUENCY.MONTH &&
    draft.due_date.trim()
  ) {
    const dueDate = Number.parseInt(draft.due_date, 10);
    if (dueDate >= 1 && dueDate <= 31) {
      item.due_date = dueDate;
    }
  }

  return item;
}

export function isExpenseDraftComplete(draft: ExpenseFormDraft): boolean {
  return buildExpenseItemFromDraft(draft) !== null;
}
