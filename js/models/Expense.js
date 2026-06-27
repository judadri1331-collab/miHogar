import { createId } from "../utils/helpers.js";

export class Expense {
  constructor(data) {
    this.id = data.id || createId();
    this.category = data.category;
    this.subcategory = data.subcategory || null;
    this.description = data.description;
    this.amount = Number(data.amount) || 0;
    this.date = data.date;
    this.isRecurring = Boolean(data.isRecurring);
    this.paymentMethod = data.paymentMethod;
    this.isPaid = Boolean(data.isPaid);
    this.familyMemberId = data.familyMemberId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
