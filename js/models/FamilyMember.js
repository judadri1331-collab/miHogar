import { createId } from "../utils/helpers.js";

export class FamilyMember {
  constructor({ id = createId(), name, relationship, createdAt = new Date().toISOString(), isActive = true }) {
    this.id = id;
    this.name = name;
    this.relationship = relationship;
    this.createdAt = createdAt;
    this.isActive = isActive;
  }
}
