import type { ExpenseItem } from "../../types/expense";
import { supabase } from "../../supabase/client";

interface ExpenseRow {
  userkey: number;
  category: string;
  sub_category: string;
  amount: number;
  due_date?: number | null;
  frequency?: string | null;
}

function toRow(userkey: number, item: ExpenseItem): ExpenseRow {
  return {
    userkey,
    category: item.category,
    sub_category: item.sub_category,
    amount: item.amount,
    due_date: item.due_date ?? null,
    frequency: item.frequency ?? "월",
  };
}

function fromRow(row: ExpenseRow): ExpenseItem {
  const item: ExpenseItem = {
    category: row.category as ExpenseItem["category"],
    sub_category: row.sub_category,
    amount: row.amount,
  };

  if (row.due_date != null) {
    item.due_date = row.due_date;
  }
  if (row.frequency) {
    item.frequency = row.frequency as ExpenseItem["frequency"];
  }

  return item;
}

export async function listExpenses(userkey: number): Promise<ExpenseItem[]> {
  const { data, error } = await supabase
    .from("TS_MNA_EXP_INFO")
    .select("category, sub_category, amount, due_date, frequency")
    .eq("userkey", userkey)
    .order("reg_date", { ascending: true });

  if (error) {
    throw new Error(`지출 목록 조회 실패: ${error.message}`);
  }

  return (data ?? []).map((row) => fromRow(row as ExpenseRow));
}

export async function insertExpense(userkey: number, item: ExpenseItem) {
  const { error } = await supabase
    .from("TS_MNA_EXP_INFO")
    .insert(toRow(userkey, item));

  if (error) {
    throw new Error(`지출 저장 실패: ${error.message}`);
  }
}

export async function insertExpenses(userkey: number, items: ExpenseItem[]) {
  if (items.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("TS_MNA_EXP_INFO")
    .insert(items.map((item) => toRow(userkey, item)));

  if (error) {
    throw new Error(`지출 일괄 저장 실패: ${error.message}`);
  }
}
