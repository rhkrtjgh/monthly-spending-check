import { Button, Top } from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { insertExpense, listExpenses } from "../lib/supabase/expenseRepository";
import { addExpense, getExpenses, hasExpenses } from "../lib/storage/expenseStorage";
import type { ExpenseItem } from "../types/expense";
import { ExpenseInputFlow } from "./expense/ExpenseInputFlow";

function formatAmount(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

function formatExpenseMeta(item: ExpenseItem) {
  const parts: string[] = [item.category];
  if (item.due_date) {
    parts.push(`매월 ${item.due_date}일`);
  }
  if (item.frequency) {
    parts.push(item.frequency);
  }
  return parts.join(" · ");
}

export function DashboardScreen() {
  const { authMode, user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInitialInput, setIsInitialInput] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExpenses() {
      setLoadError(null);

      try {
        if (authMode === "logged_in" && user) {
          const items = await listExpenses(user.userKey);
          if (cancelled) {
            return;
          }
          setExpenses(items);
          if (items.length === 0) {
            setIsInitialInput(true);
            setIsInputOpen(true);
          }
          return;
        }

        const items = getExpenses();
        if (cancelled) {
          return;
        }
        setExpenses(items);
        if (!hasExpenses()) {
          setIsInitialInput(true);
          setIsInputOpen(true);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        console.error(error);
        setLoadError(
          error instanceof Error
            ? error.message
            : "지출 데이터를 불러오지 못했습니다.",
        );
      }
    }

    void loadExpenses();

    return () => {
      cancelled = true;
    };
  }, [authMode, user]);

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

  const handleComplete = useCallback(
    async (item: ExpenseItem) => {
      setLoadError(null);

      try {
        if (authMode === "logged_in" && user) {
          await insertExpense(user.userKey, item);
          setExpenses(await listExpenses(user.userKey));
        } else {
          addExpense(item);
          setExpenses(getExpenses());
        }
        setIsInputOpen(false);
        setIsInitialInput(false);
      } catch (error) {
        console.error(error);
        setLoadError(
          error instanceof Error ? error.message : "지출 저장에 실패했습니다.",
        );
      }
    },
    [authMode, user],
  );

  const handleCloseInput = useCallback(() => {
    setIsInputOpen(false);
    setIsInitialInput(false);
  }, []);

  const openAddFlow = useCallback(() => {
    setIsInitialInput(false);
    setIsInputOpen(true);
  }, []);

  return (
    <>
      <Top
        title={<Top.TitleParagraph size={22}>월지출계산기</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={17}>
            이번 달 고정지출을 확인해 보세요
          </Top.SubtitleParagraph>
        }
      />

      {loadError ? (
        <p
          style={{
            margin: "0 20px 16px",
            color: "#E42939",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {loadError}
        </p>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "0 20px 32px",
        }}
      >
        <section
          style={{
            padding: 20,
            borderRadius: 16,
            background: "linear-gradient(135deg, #FFF5FB 0%, #F8F4FF 100%)",
          }}
        >
          <p style={{ margin: 0, color: "#6B7684", fontSize: 14 }}>
            이번 달 총 고정지출
          </p>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 28,
              fontWeight: 700,
              color: "#191F28",
            }}
          >
            {formatAmount(totalAmount)}
          </p>
          <p style={{ margin: "8px 0 0", color: "#8B95A1", fontSize: 14 }}>
            연간 예상 {formatAmount(totalAmount * 12)}
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#F9FAFB",
            }}
          >
            <p style={{ margin: 0, color: "#6B7684", fontSize: 13 }}>
              생활 고정비
            </p>
            <p style={{ margin: "6px 0 0", fontWeight: 600 }}>
              {formatAmount(livingAmount)}
            </p>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#F9FAFB",
            }}
          >
            <p style={{ margin: 0, color: "#6B7684", fontSize: 13 }}>
              구독 서비스
            </p>
            <p style={{ margin: "6px 0 0", fontWeight: 600 }}>
              {formatAmount(subscriptionAmount)}
            </p>
          </div>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>
              등록한 항목
            </h2>
            <Button size="small" variant="weak" onClick={openAddFlow}>
              추가
            </Button>
          </div>

          {expenses.length === 0 ? (
            <div
              style={{
                padding: 24,
                borderRadius: 12,
                backgroundColor: "#F9FAFB",
                textAlign: "center",
                color: "#6B7684",
                lineHeight: 1.6,
              }}
            >
              아직 등록된 지출이 없어요.
              <br />
              고정지출을 입력해 보세요.
            </div>
          ) : (
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {expenses.map((item, index) => (
                <li
                  key={`${item.sub_category}-${item.amount}-${index}`}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EEF1F4",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>
                        {item.sub_category}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#8B95A1",
                          fontSize: 13,
                        }}
                      >
                        {formatExpenseMeta(item)}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {formatAmount(item.amount)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ExpenseInputFlow
        open={isInputOpen}
        allowDismiss={!isInitialInput}
        onComplete={handleComplete}
        onClose={handleCloseInput}
      />
    </>
  );
}
