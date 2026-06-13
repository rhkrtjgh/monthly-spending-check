import {
  BottomCTA,
  CTAButton,
  SegmentedControl,
  TextField,
  Top,
} from "@toss/tds-mobile";
import { useMemo, useState, type CSSProperties } from "react";

import config from "../../../granite.config.ts";
import { getSubCategoryOptions, getSubCategoryPlaceholder } from "../../constants/expenseSubCategories";
import { getAmountInputHint } from "../../lib/expense/convertToMonthlyAmount";
import { parseAmountInput } from "../../lib/expense/parseAmountInput";
import {
  buildExpenseItemFromDraft,
  isExpenseDraftComplete,
} from "../../lib/expense/buildExpenseItem";
import { MainCategoryIcon, SubCategoryIcon } from "./CategoryIcon";
import type {
  ExpenseCategory,
  ExpenseFormDraft,
  ExpenseFrequency,
  ExpenseItem,
} from "../../types/expense";
import {
  EXPENSE_CATEGORY,
  EXPENSE_FREQUENCY,
} from "../../types/expense";
import "./ExpenseInputFlow.css";

const BRAND_COLOR = config.brand.primaryColor;
const TOTAL_STEPS = 4;

const CATEGORY_OPTIONS: {
  value: ExpenseCategory;
  title: string;
  description: string;
}[] = [
  {
    value: EXPENSE_CATEGORY.LIVING,
    title: "생활 고정비",
    description: "월세, 관리비, 통신비, 보험료 등",
  },
  {
    value: EXPENSE_CATEGORY.SUBSCRIPTION,
    title: "구독 서비스",
    description: "넷플릭스, 유튜브, ChatGPT 등",
  },
];

const FREQUENCY_OPTIONS = [
  { label: "주", value: EXPENSE_FREQUENCY.WEEK },
  { label: "월", value: EXPENSE_FREQUENCY.MONTH },
  { label: "년", value: EXPENSE_FREQUENCY.YEAR },
];

const INITIAL_DRAFT: ExpenseFormDraft = {
  category: null,
  sub_category_group: null,
  sub_category: "",
  amount: "",
  due_date: "",
  frequency: null,
};

interface ExpenseInputFlowProps {
  open: boolean;
  allowDismiss?: boolean;
  showSkip?: boolean;
  onComplete: (item: ExpenseItem) => void;
  onClose?: () => void;
}

function StepFooter({
  showBack,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  showBack: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled: boolean;
}) {
  if (!showBack) {
    return (
      <BottomCTA.Single
        fixed={false}
        background="none"
        disabled={nextDisabled}
        onClick={onNext}
      >
        {nextLabel}
      </BottomCTA.Single>
    );
  }

  return (
    <BottomCTA.Double
      fixed={false}
      background="none"
      leftButton={
        <CTAButton size="xlarge" variant="weak" display="block" onClick={onBack}>
          이전
        </CTAButton>
      }
      rightButton={
        <CTAButton
          size="xlarge"
          display="block"
          disabled={nextDisabled}
          onClick={onNext}
        >
          {nextLabel}
        </CTAButton>
      }
    />
  );
}

export function ExpenseInputFlow({
  open,
  allowDismiss = false,
  showSkip = false,
  onComplete,
  onClose,
}: ExpenseInputFlowProps) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ExpenseFormDraft>(INITIAL_DRAFT);

  const subCategoryOptions = useMemo(
    () => getSubCategoryOptions(draft.category),
    [draft.category],
  );

  const itemNamePlaceholder = useMemo(
    () => getSubCategoryPlaceholder(draft.sub_category_group),
    [draft.sub_category_group],
  );

  const stepMeta = useMemo(() => {
    switch (step) {
      case 1:
        return {
          title: "어떤 지출인가요?",
          subtitle: "카테고리를 선택해 주세요",
        };
      case 2:
        return {
          title: "세부 카테고리를 선택해 주세요",
          subtitle: `${draft.category ?? ""} 항목 중 해당하는 분류를 골라주세요`,
        };
      case 3:
        return {
          title: "항목명을 입력해 주세요",
          subtitle: "어떤 고정지출인지 알려주세요",
        };
      default:
        return {
          title: "금액과 결제 정보",
          subtitle: "빈도를 선택한 뒤 금액을 입력해 주세요",
        };
    }
  }, [step, draft.category]);

  const canProceedStep1 = draft.category !== null;
  const canProceedStep2 = draft.sub_category_group !== null;
  const canProceedStep3 = draft.sub_category.trim().length > 0;
  const canCompleteStep4 =
    draft.frequency !== null && isExpenseDraftComplete(draft);

  const amountInputHint = getAmountInputHint(draft.frequency);

  if (!open) {
    return null;
  }

  const handleReset = () => {
    setStep(1);
    setDraft(INITIAL_DRAFT);
  };

  const handleComplete = () => {
    const item = buildExpenseItemFromDraft(draft);
    if (!item) {
      return;
    }

    onComplete(item);
    handleReset();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      return;
    }

    if (allowDismiss) {
      handleReset();
      onClose?.();
    }
  };

  const handleDismiss = () => {
    handleReset();
    onClose?.();
  };

  const handleSelectCategory = (category: ExpenseCategory) => {
    setDraft((prev) => ({
      ...prev,
      category,
      sub_category_group: null,
    }));
  };

  return (
    <div
      className="expense-input-flow"
      style={{ "--brand-color": BRAND_COLOR } as CSSProperties}
    >
      <Top
        title={<Top.TitleParagraph size={22}>{stepMeta.title}</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {stepMeta.subtitle}
          </Top.SubtitleParagraph>
        }
      />

      {allowDismiss || showSkip ? (
        <div className="expense-input-flow__header-action">
          {showSkip ? (
            <button
              type="button"
              className="expense-input-flow__skip"
              onClick={handleDismiss}
            >
              건너뛰기
            </button>
          ) : null}
          {allowDismiss && step === 1 ? (
            <button
              type="button"
              className="expense-input-flow__dismiss"
              onClick={handleDismiss}
            >
              닫기
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="expense-input-flow__body">
        <p className="expense-input-flow__step-label">
          {step} / {TOTAL_STEPS}
        </p>

        {step === 1 ? (
          <div className="expense-input-flow__category-list">
            {CATEGORY_OPTIONS.map((option) => {
              const selected = draft.category === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`expense-input-flow__category-card${
                    selected ? " expense-input-flow__category-card--selected" : ""
                  }`}
                  onClick={() => handleSelectCategory(option.value)}
                >
                  <MainCategoryIcon category={option.value} selected={selected} />
                  <div className="expense-input-flow__category-body">
                    <p className="expense-input-flow__category-title">
                      {option.title}
                    </p>
                    <p className="expense-input-flow__category-desc">
                      {option.description}
                    </p>
                  </div>
                  <span aria-hidden>{selected ? "●" : "○"}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="expense-input-flow__category-list">
            {subCategoryOptions.map((option) => {
              const selected = draft.sub_category_group === option.title;

              return (
                <button
                  key={option.title}
                  type="button"
                  className={`expense-input-flow__category-card${
                    selected ? " expense-input-flow__category-card--selected" : ""
                  }`}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      sub_category_group: option.title,
                    }))
                  }
                >
                  <SubCategoryIcon title={option.title} selected={selected} />
                  <div className="expense-input-flow__subcategory-content">
                    <p className="expense-input-flow__subcategory-title">
                      {option.title}
                    </p>
                    <p className="expense-input-flow__subcategory-desc">
                      {option.descriptions.join(", ")}
                    </p>
                  </div>
                  <span aria-hidden>{selected ? "●" : "○"}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="expense-input-flow__field-group">
            <div>
              <TextField.Clearable
                variant="line"
                label="항목명"
                placeholder={itemNamePlaceholder}
                value={draft.sub_category}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    sub_category: event.target.value,
                  }))
                }
              />
              <p className="expense-input-flow__hint">
                {draft.category} · {draft.sub_category_group}
              </p>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="expense-input-flow__field-group">
            <div>
              <label className="expense-input-flow__field-label">빈도</label>
              <SegmentedControl
                value={draft.frequency ?? ""}
                onChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    frequency: value as ExpenseFrequency,
                    due_date:
                      value === EXPENSE_FREQUENCY.MONTH ? prev.due_date : "",
                    amount: prev.amount
                      ? parseAmountInput(prev.amount, value as ExpenseFrequency)
                      : prev.amount,
                  }))
                }
              >
                {FREQUENCY_OPTIONS.map((option) => (
                  <SegmentedControl.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SegmentedControl.Item>
                ))}
              </SegmentedControl>
            </div>

            <div>
              <label className="expense-input-flow__field-label">금액</label>
              <TextField.Clearable
                variant="line"
                placeholder="0"
                inputMode="numeric"
                suffix="원"
                value={draft.amount}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    amount: parseAmountInput(
                      event.target.value,
                      draft.frequency,
                    ),
                  }))
                }
              />
              <p className="expense-input-flow__hint">{amountInputHint}</p>
            </div>

            {draft.frequency === EXPENSE_FREQUENCY.MONTH ? (
              <div>
                <label className="expense-input-flow__field-label">
                  결제일
                  <span className="expense-input-flow__optional">(선택)</span>
                </label>
                <TextField.Clearable
                  variant="line"
                  placeholder="1~31"
                  inputMode="numeric"
                  suffix="일"
                  value={draft.due_date}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      due_date: event.target.value.replace(/[^\d]/g, "").slice(0, 2),
                    }))
                  }
                />
              </div>
            ) : null}

            <p className="expense-input-flow__hint">
              {draft.sub_category_group} · {draft.sub_category || "항목"} ·{" "}
              {draft.category}
            </p>
          </div>
        ) : null}
      </div>

      <div className="expense-input-flow__footer">
        {step === 1 ? (
          <StepFooter
            showBack={false}
            onBack={handleBack}
            onNext={() => setStep(2)}
            nextLabel="다음"
            nextDisabled={!canProceedStep1}
          />
        ) : null}

        {step === 2 ? (
          <StepFooter
            showBack
            onBack={handleBack}
            onNext={() => setStep(3)}
            nextLabel="다음"
            nextDisabled={!canProceedStep2}
          />
        ) : null}

        {step === 3 ? (
          <StepFooter
            showBack
            onBack={handleBack}
            onNext={() => setStep(4)}
            nextLabel="다음"
            nextDisabled={!canProceedStep3}
          />
        ) : null}

        {step === 4 ? (
          <StepFooter
            showBack
            onBack={handleBack}
            onNext={handleComplete}
            nextLabel="저장하기"
            nextDisabled={!canCompleteStep4}
          />
        ) : null}
      </div>
    </div>
  );
}
