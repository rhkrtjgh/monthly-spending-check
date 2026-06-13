import { EXPENSE_CATEGORY, type ExpenseCategory } from "../types/expense";

export interface SubCategoryOption {
  title: string;
  descriptions: string[];
  placeholder: string;
}

export const LIVING_SUB_CATEGORIES: SubCategoryOption[] = [
  {
    title: "식비",
    descriptions: ["외식", "카페/간식", "편의점/마트", "배달음식"],
    placeholder: "예: 배달의민족, 스타벅스",
  },
  {
    title: "주거/통신",
    descriptions: ["월세/관리비", "통신비", "공과금", "인테리어/가구"],
    placeholder: "예: 월세, 케이티 인터넷",
  },
  {
    title: "교통/차량",
    descriptions: ["대중교통", "택시", "주유/충전", "차량유지비"],
    placeholder: "예: 지하철 정기권, 주유",
  },
  {
    title: "쇼핑/뷰티",
    descriptions: ["패션/쇼핑", "뷰티/미용"],
    placeholder: "예: 무신사, 올리브영",
  },
  {
    title: "건강/문화",
    descriptions: ["의료/건강", "교육", "문화/예술", "운동"],
    placeholder: "예: 필라테스, 씨지브이",
  },
  {
    title: "기타",
    descriptions: ["경조사", "세금/이자", "반려동물"],
    placeholder: "예: 반려동물 병원, 보험료",
  },
];

export const SUBSCRIPTION_SUB_CATEGORIES: SubCategoryOption[] = [
  {
    title: "미디어",
    descriptions: ["OTT(영상)", "음원", "게임 구독"],
    placeholder: "예: 넷플릭스, 유튜브 프리미엄",
  },
  {
    title: "쇼핑/혜택",
    descriptions: ["멤버십", "정기배송"],
    placeholder: "예: 쿠팡 와우, 정기배송",
  },
  {
    title: "생활/편의",
    descriptions: ["렌탈(정수기/비데)", "보안", "세탁 서비스"],
    placeholder: "예: 정수기 렌탈, 씨씨티비",
  },
  {
    title: "자기계발",
    descriptions: ["도서(전자책)", "온라인 강의", "스터디 그룹"],
    placeholder: "예: 인프런, 리디북스",
  },
  {
    title: "업무/IT",
    descriptions: [
      "클라우드(iCloud/Google One)",
      "업무 툴(Notion/Adobe)",
      "소프트웨어 구독",
    ],
    placeholder: "예: 노션, 아이클라우드+",
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

export function getSubCategoryPlaceholder(group: string | null): string {
  if (!group) {
    return "항목명을 입력해 주세요";
  }

  const option = [...LIVING_SUB_CATEGORIES, ...SUBSCRIPTION_SUB_CATEGORIES].find(
    (item) => item.title === group,
  );

  return option?.placeholder ?? "항목명을 입력해 주세요";
}
