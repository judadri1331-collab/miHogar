import { Budget } from "../models/Budget.js";
import { STORAGE_KEYS } from "../utils/constants.js";

export class BudgetService {
  constructor(storage) {
    this.storage = storage;
  }

  getByMonth(month) {
    return this.storage.get(STORAGE_KEYS.budgets).filter((budget) => budget.month === month);
  }

  saveMany(month, budgetItems) {
    const existing = this.storage.get(STORAGE_KEYS.budgets).filter((budget) => budget.month !== month);
    const next = budgetItems.map((item) => new Budget({ ...item, month }));
    this.storage.set(STORAGE_KEYS.budgets, [...existing, ...next]);
  }
}
