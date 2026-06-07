import { EXPENSE_CATEGORY, type ExpenseCategory } from "../types/expense";

export const MAIN_CATEGORY_ICON_IDS: Record<ExpenseCategory, string> = {
  [EXPENSE_CATEGORY.LIVING]: "expense-living",
  [EXPENSE_CATEGORY.SUBSCRIPTION]: "expense-subscription",
};

export const SUB_CATEGORY_ICON_IDS: Record<string, string> = {
  식비: "expense-food",
  "주거/통신": "expense-housing",
  "교통/차량": "expense-transport",
  "쇼핑/뷰티": "expense-shopping-beauty",
  "건강/문화": "expense-health-culture",
  기타: "expense-etc",
  미디어: "expense-media",
  "쇼핑/혜택": "expense-shopping-benefit",
  "생활/편의": "expense-life-convenience",
  자기계발: "expense-self-dev",
  "업무/IT": "expense-work-it",
};

export const EXPENSE_CATEGORY_SPRITE = "/sprites/expense-categories.svg";

export interface CategoryIconColor {
  background: string;
  accent: string;
}

export const CATEGORY_ICON_COLORS: Record<string, CategoryIconColor> = {
  "expense-living": { background: "#FFF0F8", accent: "#FF91D5" },
  "expense-subscription": { background: "#F0F3FF", accent: "#6B7CFF" },
  "expense-food": { background: "#FFF4ED", accent: "#FF8C42" },
  "expense-housing": { background: "#EDF4FF", accent: "#4B8BFF" },
  "expense-transport": { background: "#E8FAF8", accent: "#2EC4B6" },
  "expense-shopping-beauty": { background: "#FCF0FF", accent: "#D96CFF" },
  "expense-health-culture": { background: "#ECFBF2", accent: "#2ECC71" },
  "expense-etc": { background: "#F2F4F6", accent: "#8B95A1" },
  "expense-media": { background: "#FFF0F0", accent: "#FF6B6B" },
  "expense-shopping-benefit": { background: "#FFF8E8", accent: "#FFB020" },
  "expense-life-convenience": { background: "#EDF7FF", accent: "#45AAF2" },
  "expense-self-dev": { background: "#F4EEFF", accent: "#9B59B6" },
  "expense-work-it": { background: "#EEF2FF", accent: "#3867D6" },
};

export function getCategoryIconColor(iconId: string): CategoryIconColor {
  return (
    CATEGORY_ICON_COLORS[iconId] ?? {
      background: "#F2F4F6",
      accent: "#4E5968",
    }
  );
}

export function getMainCategoryIconId(category: ExpenseCategory): string {
  return MAIN_CATEGORY_ICON_IDS[category];
}

export function getSubCategoryIconId(title: string): string {
  return SUB_CATEGORY_ICON_IDS[title] ?? "expense-etc";
}
