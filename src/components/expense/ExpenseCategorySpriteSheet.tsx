import { useEffect, useState } from "react";

import { EXPENSE_CATEGORY_SPRITE } from "../../constants/expenseCategoryIcons";

let spritePromise: Promise<string> | null = null;

function loadExpenseCategorySprite() {
  if (!spritePromise) {
    spritePromise = fetch(EXPENSE_CATEGORY_SPRITE).then((response) => {
      if (!response.ok) {
        throw new Error("카테고리 아이콘 스프라이트를 불러오지 못했습니다.");
      }
      return response.text();
    });
  }
  return spritePromise;
}

export function ExpenseCategorySpriteSheet() {
  const [spriteMarkup, setSpriteMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;

    loadExpenseCategorySprite()
      .then((markup) => {
        if (!cancelled) {
          setSpriteMarkup(markup);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!spriteMarkup) {
    return null;
  }

  return (
    <div
      aria-hidden
      style={{ display: "none" }}
      dangerouslySetInnerHTML={{ __html: spriteMarkup }}
    />
  );
}
