import {
  EXPENSE_FREQUENCY,
  type ExpenseFrequency,
} from "../../types/expense";

export function convertToMonthlyAmount(
  amount: number,
  frequency: ExpenseFrequency,
): number {
  switch (frequency) {
    case EXPENSE_FREQUENCY.WEEK:
      return Math.round((amount * 52) / 12);
    case EXPENSE_FREQUENCY.YEAR:
      return Math.round(amount / 12);
    case EXPENSE_FREQUENCY.MONTH:
      return amount;
    default:
      return amount;
  }
}

export function getAmountInputHint(frequency: ExpenseFrequency | null): string {
  switch (frequency) {
    case EXPENSE_FREQUENCY.WEEK:
      return "주당 금액을 입력해 주세요. 저장 시 월 금액으로 환산돼요.";
    case EXPENSE_FREQUENCY.YEAR:
      return "연간 금액을 입력해 주세요. 저장 시 월 금액으로 환산돼요.";
    case EXPENSE_FREQUENCY.MONTH:
      return "월 결제 금액을 입력해 주세요.";
    default:
      return "빈도를 먼저 선택해 주세요.";
  }
}
