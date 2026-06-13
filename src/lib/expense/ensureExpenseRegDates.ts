import type { ExpenseItem } from "../../types/expense";

const REG_DATE_FALLBACK_SPACING_MS = 1000;

function getRegTime(regDate?: string): number | null {
  if (!regDate) {
    return null;
  }

  const time = new Date(regDate).getTime();
  return Number.isFinite(time) ? time : null;
}

export function ensureExpenseRegDates(items: ExpenseItem[]): ExpenseItem[] {
  const baseTime = Date.now() - items.length * REG_DATE_FALLBACK_SPACING_MS;

  return items.map((item, index) => {
    if (getRegTime(item.reg_date) != null) {
      return item;
    }

    return {
      ...item,
      reg_date: new Date(
        baseTime + index * REG_DATE_FALLBACK_SPACING_MS,
      ).toISOString(),
    };
  });
}
