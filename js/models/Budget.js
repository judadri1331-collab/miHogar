import { createId } from "../utils/helpers.js";

export class Budget {
  constructor({ id = createId(), category, month, limitAmount = 0, createdAt = new Date().toISOString() }) {
    this.id = id;
    this.category = category;
    this.month = month;
    this.limitAmount = Number(limitAmount) || 0;
    this.createdAt = createdAt;
  }
}
