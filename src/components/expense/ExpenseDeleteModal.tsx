import { BottomCTA, CTAButton, Top } from "@toss/tds-mobile";
import { useMemo } from "react";

import type { ExpenseItem } from "../../types/expense";
import { MainCategoryIcon } from "./CategoryIcon";
import "./ExpenseDeleteModal.css";

interface ExpenseDeleteModalProps {
  open: boolean;
  items: ExpenseItem[];
  pendingDeleteIds: Set<string>;
  formatAmount: (amount: number) => string;
  formatExpenseMeta: (item: ExpenseItem) => string;
  onMarkDelete: (id: string) => void;
  onCancel: () => void;
  onComplete: () => void;
}

export function ExpenseDeleteModal({
  open,
  items,
  pendingDeleteIds,
  formatAmount,
  formatExpenseMeta,
  onMarkDelete,
  onCancel,
  onComplete,
}: ExpenseDeleteModalProps) {
  const visibleItems = useMemo(
    () => items.filter((item) => item.id && !pendingDeleteIds.has(item.id)),
    [items, pendingDeleteIds],
  );

  if (!open) {
    return null;
  }

  return (
    <div className="expense-delete-modal">
      <Top
        title={<Top.TitleParagraph size={22}>항목 편집</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            − 버튼을 눌러 삭제할 항목을 선택해 주세요
          </Top.SubtitleParagraph>
        }
      />

      <div className="expense-delete-modal__body">
        {visibleItems.length === 0 ? (
          <div className="expense-delete-modal__empty">
            삭제할 항목을 모두 선택했어요.
            <br />
            편집 완료를 눌러 변경 사항을 저장해 주세요.
          </div>
        ) : (
          <ul className="expense-delete-modal__list">
            {visibleItems.map((item, index) => {
              const itemMeta = formatExpenseMeta(item);
              const itemId =
                item.id ??
                `${item.sub_category}-${item.amount}-${item.reg_date ?? index}`;

              return (
                <li key={itemId} className="expense-delete-modal__list-item">
                  <div className="expense-delete-modal__item-row">
                    <button
                      type="button"
                      className="expense-delete-modal__delete-toggle"
                      aria-label={`${item.sub_category} 삭제`}
                      onClick={() => {
                        if (item.id) {
                          onMarkDelete(item.id);
                        }
                      }}
                    >
                      −
                    </button>

                    <div className="expense-delete-modal__item-content">
                      <div className="expense-delete-modal__item-main">
                        <span
                          className="expense-delete-modal__item-icon"
                          aria-hidden="true"
                        >
                          <MainCategoryIcon category={item.category} />
                        </span>
                        <div className="expense-delete-modal__item-text">
                          <p className="expense-delete-modal__item-name">
                            {item.sub_category}
                          </p>
                          {itemMeta ? (
                            <p className="expense-delete-modal__item-meta">
                              {itemMeta}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <p className="expense-delete-modal__item-amount">
                        {formatAmount(item.amount)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="expense-delete-modal__footer">
        <BottomCTA.Double
          fixed={false}
          background="none"
          leftButton={
            <CTAButton size="xlarge" variant="weak" display="block" onClick={onCancel}>
              취소
            </CTAButton>
          }
          rightButton={
            <CTAButton size="xlarge" display="block" onClick={onComplete}>
              {pendingDeleteIds.size > 0
                ? `편집 완료 (${pendingDeleteIds.size})`
                : "편집 완료"}
            </CTAButton>
          }
        />
      </div>
    </div>
  );
}
