import { EXPENSE_CATEGORY, type ExpenseCategory } from "../types/expense";

export interface SubCategoryOption {
  title: string;
  descriptions: string[];
}

export const LIVING_SUB_CATEGORIES: SubCategoryOption[] = [
  {
    title: "식비",
    descriptions: ["외식", "카페/간식", "편의점/마트", "배달음식"],
  },
  {
    title: "주거/통신",
    descriptions: ["월세/관리비", "통신비", "공과금", "인테리어/가구"],
  },
  {
    title: "교통/차량",
    descriptions: ["대중교통", "택시", "주유/충전", "차량유지비"],
  },
  {
    title: "쇼핑/뷰티",
    descriptions: ["패션/쇼핑", "뷰티/미용"],
  },
  {
    title: "건강/문화",
    descriptions: ["의료/건강", "교육", "문화/예술", "운동"],
  },
  {
    title: "기타",
    descriptions: ["경조사", "세금/이자", "반려동물"],
  },
];

export const SUBSCRIPTION_SUB_CATEGORIES: SubCategoryOption[] = [
  {
    title: "미디어",
    descriptions: ["OTT(영상)", "음원", "게임 구독"],
  },
  {
    title: "쇼핑/혜택",
    descriptions: ["멤버십", "정기배송"],
  },
  {
    title: "생활/편의",
    descriptions: ["렌탈(정수기/비데)", "보안", "세탁 서비스"],
  },
  {
    title: "자기계발",
    descriptions: ["도서(전자책)", "온라인 강의", "스터디 그룹"],
  },
  {
    title: "업무/IT",
    descriptions: [
      "클라우드(iCloud/Google One)",
      "업무 툴(Notion/Adobe)",
      "소프트웨어 구독",
    ],
  },
];

export function getSubCategoryOptions(
  category: ExpenseCategory | null,
): SubCategoryOption[] {
  if (category === EXPENSE_CATEGORY.LIVING) {
    return LIVING_SUB_CATEGORIES;
  }
  if (category === EXPENSE_CATEGORY.SUBSCRIPTION) {
    return SUBSCRIPTION_SUB_CATEGORIES;
  }
  return [];
}
