import {
  EXPENSE_CATEGORY,
  type ExpenseCategory,
  type ExpenseItem,
  type ExpenseSortOrder,
} from "../../types/expense";

const CATEGORY_ORDER: Record<ExpenseCategory, number> = {
  [EXPENSE_CATEGORY.LIVING]: 0,
  [EXPENSE_CATEGORY.SUBSCRIPTION]: 1,
};

function getSubCategoryGroup(subCategory: string): string {
  const [group] = subCategory.split(" · ");
  return group ?? subCategory;
}

function getRegTime(item: ExpenseItem): number {
  if (!item.reg_date) {
    return 0;
  }

  const time = new Date(item.reg_date).getTime();
  return Number.isFinite(time) ? time : 0;
}

function compareLatest(a: ExpenseItem, b: ExpenseItem) {
  const aTime = getRegTime(a);
  const bTime = getRegTime(b);
  if (bTime !== aTime) {
    return bTime - aTime;
  }

  return a.sub_category.localeCompare(b.sub_category, "ko");
}

function compareAmount(a: ExpenseItem, b: ExpenseItem) {
  if (b.amount !== a.amount) {
    return b.amount - a.amount;
  }
  return compareLatest(a, b);
}

function compareCategory(a: ExpenseItem, b: ExpenseItem) {
  const categoryDiff =
    (CATEGORY_ORDER[a.category] ?? 99) - (CATEGORY_ORDER[b.category] ?? 99);
  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  const groupDiff = getSubCategoryGroup(a.sub_category).localeCompare(
    getSubCategoryGroup(b.sub_category),
    "ko",
  );
  if (groupDiff !== 0) {
    return groupDiff;
  }

  return a.sub_category.localeCompare(b.sub_category, "ko");
}

export function sortExpenses(
  items: ExpenseItem[],
  order: ExpenseSortOrder,
  reverse = false,
): ExpenseItem[] {
  const sorted = [...items];
  const direction = reverse ? -1 : 1;

  switch (order) {
    case "latest":
      return sorted.sort((a, b) => direction * compareLatest(a, b));
    case "amount":
      return sorted.sort((a, b) => direction * compareAmount(a, b));
    case "category":
      return sorted.sort((a, b) => direction * compareCategory(a, b));
    default:
      return sorted;
  }
}

export const EXPENSE_SORT_OPTIONS: {
  value: ExpenseSortOrder;
  label: string;
}[] = [
  { value: "latest", label: "최신순" },
  { value: "amount", label: "금액순" },
  { value: "category", label: "분류순" },
];
