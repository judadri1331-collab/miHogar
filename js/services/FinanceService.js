import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { STORAGE_KEYS } from "../utils/constants.js";

export class FinanceService {
  constructor(storage) {
    this.storage = storage;
  }

  getIncomes() {
    return this.storage.get(STORAGE_KEYS.incomes);
  }

  getExpenses() {
    return this.storage.get(STORAGE_KEYS.expenses);
  }

  saveIncome(data) {
    return this.#upsert(STORAGE_KEYS.incomes, new Income(data));
  }

  saveExpense(data) {
    return this.#upsert(STORAGE_KEYS.expenses, new Expense(data));
  }

  removeIncome(id) {
    this.#remove(STORAGE_KEYS.incomes, id);
  }

  removeExpense(id) {
    this.#remove(STORAGE_KEYS.expenses, id);
  }

  #upsert(key, record) {
    const items = this.storage.get(key);
    const index = items.findIndex((item) => item.id === record.id);
    if (index >= 0) items[index] = { ...items[index], ...record };
    else items.push(record);
    this.storage.set(key, items);
    return record;
  }

  #remove(key, id) {
    this.storage.set(key, this.storage.get(key).filter((item) => item.id !== id));
  }
}
