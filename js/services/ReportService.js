import { EXPENSE_CATEGORIES } from "../utils/constants.js";
import { getLastMonths, isInMonth, sumBy } from "../utils/helpers.js";

export class ReportService {
  getMonthData({ month, incomes, expenses, budgets }) {
    const monthIncomes = incomes.filter((item) => isInMonth(item.date, month));
    const monthExpenses = expenses.filter((item) => isInMonth(item.date, month));
    const incomeTotal = sumBy(monthIncomes, (item) => item.amount);
    const expenseTotal = sumBy(monthExpenses, (item) => item.amount);
    const balance = incomeTotal - expenseTotal;
    const savingRate = incomeTotal > 0 ? (balance / incomeTotal) * 100 : 0;

    return {
      monthIncomes,
      monthExpenses,
      incomeTotal,
      expenseTotal,
      balance,
      savingRate,
      expensesByCategory: this.getExpensesByCategory(monthExpenses),
      budgetStatus: this.getBudgetStatus(monthExpenses, budgets),
      topExpenses: [...monthExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5)
    };
  }

  getExpensesByCategory(expenses) {
    return EXPENSE_CATEGORIES.map((category) => ({
      category: category.name,
      color: category.color,
      total: sumBy(expenses.filter((expense) => expense.category === category.name), (expense) => expense.amount)
    })).filter((item) => item.total > 0);
  }

  getBudgetStatus(expenses, budgets) {
    return EXPENSE_CATEGORIES.map((category) => {
      const budget = budgets.find((item) => item.category === category.name);
      const spent = sumBy(expenses.filter((expense) => expense.category === category.name), (expense) => expense.amount);
      const limit = Number(budget?.limitAmount) || 0;
      const percent = limit > 0 ? (spent / limit) * 100 : 0;
      return { category: category.name, color: category.color, spent, limit, percent };
    });
  }

  getSixMonthSeries(selectedMonth, incomes, expenses) {
    return getLastMonths(selectedMonth).map((month) => ({
      month,
      incomes: sumBy(incomes.filter((item) => isInMonth(item.date, month)), (item) => item.amount),
      expenses: sumBy(expenses.filter((item) => isInMonth(item.date, month)), (item) => item.amount)
    }));
  }
}
