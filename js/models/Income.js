import { createId } from "../utils/helpers.js";

export class Income {
  constructor(data) {
    this.id = data.id || createId();
    this.familyMemberId = data.familyMemberId;
    this.type = data.type;
    this.description = data.description;
    this.amount = Number(data.amount) || 0;
    this.date = data.date;
    this.isRecurring = Boolean(data.isRecurring);
    this.frequency = data.frequency || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
