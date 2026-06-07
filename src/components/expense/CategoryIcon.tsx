import type { CSSProperties } from "react";

import {
  getCategoryIconColor,
  getMainCategoryIconId,
  getSubCategoryIconId,
} from "../../constants/expenseCategoryIcons";
import type { ExpenseCategory } from "../../types/expense";
import "./CategoryIcon.css";

interface CategoryIconProps {
  iconId: string;
  size?: number;
  selected?: boolean;
}

export function CategoryIcon({
  iconId,
  size = 24,
  selected = false,
}: CategoryIconProps) {
  const colors = getCategoryIconColor(iconId);

  return (
    <span
      className={`category-icon${selected ? " category-icon--selected" : ""}`}
      style={
        {
          "--icon-bg": colors.background,
          "--icon-accent": colors.accent,
        } as CSSProperties
      }
      aria-hidden
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <use href={`#${iconId}`} />
      </svg>
    </span>
  );
}

export function MainCategoryIcon({
  category,
  selected = false,
}: {
  category: ExpenseCategory;
  selected?: boolean;
}) {
  return (
    <CategoryIcon
      iconId={getMainCategoryIconId(category)}
      selected={selected}
    />
  );
}

export function SubCategoryIcon({
  title,
  selected = false,
}: {
  title: string;
  selected?: boolean;
}) {
  return (
    <CategoryIcon iconId={getSubCategoryIconId(title)} selected={selected} />
  );
}
