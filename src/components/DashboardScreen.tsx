import { Button, Top } from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getCategoryIconColor,
  getMainCategoryIconId,
  getSubCategoryIconId,
} from "../constants/expenseCategoryIcons";
import {
  EXPENSE_SORT_OPTIONS,
  sortExpenses,
} from "../lib/expense/sortExpenses";
import { addExpense, deleteExpenses, getExpenses, hasExpenses, updateExpense } from "../lib/storage/expenseStorage";
import {
  isInitialGuideCompleted,
  setInitialGuideCompleted,
} from "../lib/storage/localStorage";
import type { ExpenseItem, ExpenseSortOrder } from "../types/expense";
import { MainCategoryIcon } from "./expense/CategoryIcon";
import { ExpenseDeleteModal } from "./expense/ExpenseDeleteModal";
import { ExpenseDetailModal } from "./expense/ExpenseDetailModal";
import { ExpenseInputFlow } from "./expense/ExpenseInputFlow";
import { SortSelect } from "./expense/SortSelect";
import "./DashboardScreen.css";

function formatAmount(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

function formatExpenseMeta(item: ExpenseItem) {
  const parts: string[] = [];
  if (item.due_date) {
    parts.push(`매월 ${item.due_date}일`);
  }
  if (item.frequency) {
    parts.push(item.frequency);
  }
  return parts.join(" · ");
}

function getExpenseDisplayName(subCategory: string) {
  const parts = subCategory.split(" · ");
  return parts.length > 1 ? parts.slice(1).join(" · ") : subCategory;
}

function getExpenseAccentColor(item: ExpenseItem) {
  const [group] = item.sub_category.split(" · ");
  const iconId = group
    ? getSubCategoryIconId(group)
    : getMainCategoryIconId(item.category);

  return getCategoryIconColor(iconId).accent;
}

function formatSharePercent(share: number) {
  if (share >= 10) {
    return `${Math.round(share)}%`;
  }
  if (share >= 1) {
    return `${Math.round(share * 10) / 10}%`;
  }
  if (share > 0) {
    return `${Math.round(share * 10) / 10}%`;
  }
  return "0%";
}

interface ExpenseShareItem {
  id: string;
  label: string;
  share: number;
  color: string;
}

export function DashboardScreen() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInitialInput, setIsInitialInput] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<ExpenseSortOrder>("latest");
  const [sortReverse, setSortReverse] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    setLoadError(null);

    const items = getExpenses();
    setExpenses(items);
    if (!hasExpenses() && !isInitialGuideCompleted()) {
      setIsInitialInput(true);
      setIsInputOpen(true);
    }
  }, []);

  const totalAmount = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses],
  );

  const livingAmount = useMemo(
    () =>
      expenses
        .filter((item) => item.category === "생활 고정비")
        .reduce((sum, item) => sum + item.amount, 0),
    [expenses],
  );

  const subscriptionAmount = useMemo(
    () =>
      expenses
        .filter((item) => item.category === "구독 서비스")
        .reduce((sum, item) => sum + item.amount, 0),
    [expenses],
  );

  const expenseShares = useMemo<ExpenseShareItem[]>(() => {
    if (totalAmount <= 0) {
      return [];
    }

    return [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .map((item, index) => ({
        id: `${item.sub_category}-${item.amount}-${item.reg_date ?? index}`,
        label: getExpenseDisplayName(item.sub_category),
        share: (item.amount / totalAmount) * 100,
        color: getExpenseAccentColor(item),
      }));
  }, [expenses, totalAmount]);

  const sortedExpenses = useMemo(
    () => sortExpenses(expenses, sortOrder, sortReverse),
    [expenses, sortOrder, sortReverse],
  );

  const toggleSortReverse = useCallback(() => {
    setSortReverse((prev) => !prev);
  }, []);

  const handleComplete = useCallback((item: ExpenseItem) => {
    setLoadError(null);

    try {
      addExpense(item);
      setExpenses(getExpenses());
      if (isInitialInput) {
        setInitialGuideCompleted();
      }
      setIsInputOpen(false);
      setIsInitialInput(false);
    } catch (error) {
      console.error(error);
      setLoadError(
        error instanceof Error ? error.message : "지출 저장에 실패했습니다.",
      );
    }
  }, [isInitialInput]);

  const handleCloseInput = useCallback(() => {
    if (isInitialInput) {
      setInitialGuideCompleted();
    }
    setIsInputOpen(false);
    setIsInitialInput(false);
  }, [isInitialInput]);

  const openAddFlow = useCallback(() => {
    setIsInitialInput(false);
    setIsInputOpen(true);
  }, []);

  const handleUpdateExpense = useCallback((item: ExpenseItem) => {
    setLoadError(null);

    try {
      updateExpense(item);
      setExpenses(getExpenses());
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      setLoadError(
        error instanceof Error ? error.message : "지출 수정에 실패했습니다.",
      );
    }
  }, []);

  const startDeleteMode = useCallback(() => {
    setEditingItem(null);
    setPendingDeleteIds(new Set());
    setIsDeleteMode(true);
  }, []);

  const cancelDeleteMode = useCallback(() => {
    setPendingDeleteIds(new Set());
    setIsDeleteMode(false);
  }, []);

  const markForDelete = useCallback((id: string) => {
    setPendingDeleteIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const applyDeleteMode = useCallback(() => {
    setLoadError(null);

    try {
      if (pendingDeleteIds.size > 0) {
        deleteExpenses([...pendingDeleteIds]);
        setExpenses(getExpenses());
      }
      setPendingDeleteIds(new Set());
      setIsDeleteMode(false);
    } catch (error) {
      console.error(error);
      setLoadError(
        error instanceof Error ? error.message : "항목 삭제에 실패했습니다.",
      );
    }
  }, [pendingDeleteIds]);

  return (
    <div className="dashboard-screen">
      <Top
        title={<Top.TitleParagraph size={22}>월지출계산기</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={17}>
            이번 달 고정지출을 확인해 보세요
          </Top.SubtitleParagraph>
        }
      />

      {loadError ? <p className="dashboard-screen__error">{loadError}</p> : null}

      <div className="dashboard-screen__body">
        <div className="dashboard-screen__summary-area">
          <section className="dashboard-screen__summary">
            <div className="dashboard-screen__summary-main">
              <p className="dashboard-screen__summary-label">이번 달 총 고정지출</p>
              <p className="dashboard-screen__summary-amount">
                {formatAmount(totalAmount)}
              </p>
              <p className="dashboard-screen__summary-sub">
                연간 예상 {formatAmount(totalAmount * 12)}
              </p>
            </div>

            {expenseShares.length > 0 ? (
              <div className="dashboard-screen__breakdown">
                <p className="dashboard-screen__breakdown-title">항목별 비중</p>
                <div
                  className="dashboard-screen__breakdown-bar"
                  aria-hidden="true"
                >
                  {expenseShares.map((item) => (
                    <span
                      key={item.id}
                      className="dashboard-screen__breakdown-segment"
                      style={{
                        flexGrow: item.share,
                        backgroundColor: item.color,
                      }}
                    />
                  ))}
                </div>
                <ul className="dashboard-screen__breakdown-list">
                  {expenseShares.map((item) => (
                    <li
                      key={item.id}
                      className="dashboard-screen__breakdown-row"
                    >
                      <span
                        className="dashboard-screen__breakdown-dot"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                      />
                      <span className="dashboard-screen__breakdown-name">
                        {item.label}
                      </span>
                      <span className="dashboard-screen__breakdown-share">
                        {formatSharePercent(item.share)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section className="dashboard-screen__stats">
            <div className="dashboard-screen__stat-card">
              <p className="dashboard-screen__stat-label">생활 고정비</p>
              <p className="dashboard-screen__stat-value">
                {formatAmount(livingAmount)}
              </p>
            </div>
            <div className="dashboard-screen__stat-card">
              <p className="dashboard-screen__stat-label">구독 서비스</p>
              <p className="dashboard-screen__stat-value">
                {formatAmount(subscriptionAmount)}
              </p>
            </div>
          </section>
        </div>

        <section className="dashboard-screen__list-section">
          <div className="dashboard-screen__list-header">
            <div className="dashboard-screen__list-header-main">
              <h2 className="dashboard-screen__list-title">등록한 항목</h2>
              {expenses.length > 0 ? (
                <div className="dashboard-screen__list-controls">
                  <SortSelect
                    value={sortOrder}
                    options={EXPENSE_SORT_OPTIONS}
                    onChange={setSortOrder}
                  />
                  <button
                    type="button"
                    className={`dashboard-screen__sort-reverse${
                      sortReverse
                        ? " dashboard-screen__sort-reverse--active"
                        : ""
                    }`}
                    onClick={toggleSortReverse}
                    aria-label={sortReverse ? "오름차순" : "내림차순"}
                    title={sortReverse ? "오름차순" : "내림차순"}
                  >
                    {sortReverse ? "↑" : "↓"}
                  </button>
                </div>
              ) : null}
            </div>
            <div className="dashboard-screen__list-actions">
              {expenses.length > 0 ? (
                <Button size="small" variant="weak" onClick={startDeleteMode}>
                  편집
                </Button>
              ) : null}
              <Button size="small" variant="weak" onClick={openAddFlow}>
                추가
              </Button>
            </div>
          </div>

          <div className="dashboard-screen__list-scroll">
            {expenses.length === 0 ? (
              <div className="dashboard-screen__empty">
                아직 등록된 지출이 없어요.
                <br />
                고정지출을 입력해 보세요.
              </div>
            ) : (
              <ul className="dashboard-screen__list">
                {sortedExpenses.map((item, index) => {
                  const itemMeta = formatExpenseMeta(item);
                  const itemId =
                    item.id ??
                    `${item.sub_category}-${item.amount}-${item.reg_date ?? index}`;

                  return (
                  <li
                    key={itemId}
                    className="dashboard-screen__list-item"
                  >
                    <button
                      type="button"
                      className="dashboard-screen__item-button"
                      aria-label={`${item.sub_category} 수정`}
                      onClick={() => setEditingItem(item)}
                    >
                      <div className="dashboard-screen__item-row">
                        <div className="dashboard-screen__item-main">
                          <span
                            className="dashboard-screen__item-icon"
                            aria-hidden="true"
                          >
                            <MainCategoryIcon category={item.category} />
                          </span>
                          <div className="dashboard-screen__item-text">
                            <p className="dashboard-screen__item-name">
                              {item.sub_category}
                            </p>
                            {itemMeta ? (
                              <p className="dashboard-screen__item-meta">
                                {itemMeta}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <p className="dashboard-screen__item-amount">
                          {formatAmount(item.amount)}
                        </p>
                      </div>
                    </button>
                  </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>

      <ExpenseInputFlow
        open={isInputOpen}
        allowDismiss={!isInitialInput}
        showSkip={isInitialInput}
        onComplete={handleComplete}
        onClose={handleCloseInput}
      />

      <ExpenseDetailModal
        open={editingItem !== null && !isDeleteMode}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleUpdateExpense}
      />

      <ExpenseDeleteModal
        open={isDeleteMode}
        items={sortedExpenses}
        pendingDeleteIds={pendingDeleteIds}
        formatAmount={formatAmount}
        formatExpenseMeta={formatExpenseMeta}
        onMarkDelete={markForDelete}
        onCancel={cancelDeleteMode}
        onComplete={applyDeleteMode}
      />
    </div>
  );
}
