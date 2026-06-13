import {
  BottomCTA,
  CTAButton,
  SegmentedControl,
  TextField,
  Top,
} from "@toss/tds-mobile";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import config from "../../../granite.config.ts";
import { getSubCategoryOptions } from "../../constants/expenseSubCategories";
import { getAmountInputHint } from "../../lib/expense/convertToMonthlyAmount";
import { parseAmountInput } from "../../lib/expense/parseAmountInput";
import {
  buildExpenseItemFromDraft,
  expenseItemToFormDraft,
  isExpenseDraftComplete,
} from "../../lib/expense/buildExpenseItem";
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
import { MainCategoryIcon, SubCategoryIcon } from "./CategoryIcon";
import "./ExpenseDetailModal.css";

const BRAND_COLOR = config.brand.primaryColor;

const CATEGORY_OPTIONS: {
  value: ExpenseCategory;
  title: string;
}[] = [
  { value: EXPENSE_CATEGORY.LIVING, title: "생활 고정비" },
  { value: EXPENSE_CATEGORY.SUBSCRIPTION, title: "구독 서비스" },
];

const FREQUENCY_OPTIONS = [
  { label: "주", value: EXPENSE_FREQUENCY.WEEK },
  { label: "월", value: EXPENSE_FREQUENCY.MONTH },
  { label: "년", value: EXPENSE_FREQUENCY.YEAR },
];

interface ExpenseDetailModalProps {
  open: boolean;
  item: ExpenseItem | null;
  onClose: () => void;
  onSave: (item: ExpenseItem) => void;
}

export function ExpenseDetailModal({
  open,
  item,
  onClose,
  onSave,
}: ExpenseDetailModalProps) {
  const [draft, setDraft] = useState<ExpenseFormDraft | null>(null);

  useEffect(() => {
    if (open && item) {
      setDraft(expenseItemToFormDraft(item));
    }
  }, [open, item]);

  const subCategoryOptions = useMemo(
    () => getSubCategoryOptions(draft?.category ?? null),
    [draft?.category],
  );

  const amountInputHint = getAmountInputHint(draft?.frequency ?? null);
  const canSave = draft !== null && isExpenseDraftComplete(draft);

  if (!open || !item || !draft) {
    return null;
  }

  const handleSave = () => {
    const nextItem = buildExpenseItemFromDraft(draft, {
      id: item.id,
      reg_date: item.reg_date,
    });
    if (!nextItem) {
      return;
    }

    onSave(nextItem);
  };

  const handleSelectCategory = (category: ExpenseCategory) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            category,
            sub_category_group: null,
          }
        : prev,
    );
  };

  return (
    <div
      className="expense-detail-modal"
      style={{ "--brand-color": BRAND_COLOR } as CSSProperties}
    >
      <Top
        title={<Top.TitleParagraph size={22}>항목 상세</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            등록한 고정지출 정보를 수정할 수 있어요
          </Top.SubtitleParagraph>
        }
      />

      <div className="expense-detail-modal__body">
        <section className="expense-detail-modal__section">
          <p className="expense-detail-modal__section-title">카테고리</p>
          <div className="expense-detail-modal__category-list">
            {CATEGORY_OPTIONS.map((option) => {
              const selected = draft.category === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`expense-detail-modal__category-card${
                    selected ? " expense-detail-modal__category-card--selected" : ""
                  }`}
                  onClick={() => handleSelectCategory(option.value)}
                >
                  <MainCategoryIcon category={option.value} selected={selected} />
                  <span className="expense-detail-modal__category-title">
                    {option.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="expense-detail-modal__section">
          <p className="expense-detail-modal__section-title">세부 카테고리</p>
          <div className="expense-detail-modal__subcategory-list">
            {subCategoryOptions.map((option) => {
              const selected = draft.sub_category_group === option.title;

              return (
                <button
                  key={option.title}
                  type="button"
                  className={`expense-detail-modal__subcategory-chip${
                    selected
                      ? " expense-detail-modal__subcategory-chip--selected"
                      : ""
                  }`}
                  onClick={() =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            sub_category_group: option.title,
                          }
                        : prev,
                    )
                  }
                >
                  <SubCategoryIcon title={option.title} selected={selected} />
                  {option.title}
                </button>
              );
            })}
          </div>
        </section>

        <section className="expense-detail-modal__section">
          <label className="expense-detail-modal__field-label">항목명</label>
          <TextField.Clearable
            variant="line"
            placeholder="항목명"
            value={draft.sub_category}
            onChange={(event) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      sub_category: event.target.value,
                    }
                  : prev,
              )
            }
          />
        </section>

        <section className="expense-detail-modal__section">
          <label className="expense-detail-modal__field-label">빈도</label>
          <SegmentedControl
            value={draft.frequency ?? ""}
            onChange={(value) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      frequency: value as ExpenseFrequency,
                      due_date:
                        value === EXPENSE_FREQUENCY.MONTH ? prev.due_date : "",
                      amount: prev.amount
                        ? parseAmountInput(
                            prev.amount,
                            value as ExpenseFrequency,
                          )
                        : prev.amount,
                    }
                  : prev,
              )
            }
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <SegmentedControl.Item key={option.value} value={option.value}>
                {option.label}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>
        </section>

        <section className="expense-detail-modal__section">
          <label className="expense-detail-modal__field-label">금액</label>
          <TextField.Clearable
            variant="line"
            placeholder="0"
            inputMode="numeric"
            suffix="원"
            value={draft.amount}
            onChange={(event) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      amount: parseAmountInput(
                        event.target.value,
                        draft.frequency,
                      ),
                    }
                  : prev,
              )
            }
          />
          <p className="expense-detail-modal__hint">{amountInputHint}</p>
        </section>

        {draft.frequency === EXPENSE_FREQUENCY.MONTH ? (
          <section className="expense-detail-modal__section">
            <label className="expense-detail-modal__field-label">
              결제일
              <span className="expense-detail-modal__optional">(선택)</span>
            </label>
            <TextField.Clearable
              variant="line"
              placeholder="1~31"
              inputMode="numeric"
              suffix="일"
              value={draft.due_date}
              onChange={(event) =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        due_date: event.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, 2),
                      }
                    : prev,
                )
              }
            />
          </section>
        ) : null}
      </div>

      <div className="expense-detail-modal__footer">
        <BottomCTA.Double
          fixed={false}
          background="none"
          leftButton={
            <CTAButton size="xlarge" variant="weak" display="block" onClick={onClose}>
              취소
            </CTAButton>
          }
          rightButton={
            <CTAButton
              size="xlarge"
              display="block"
              disabled={!canSave}
              onClick={handleSave}
            >
              저장하기
            </CTAButton>
          }
        />
      </div>
    </div>
  );
}
