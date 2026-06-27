import { FamilyMember } from "../models/FamilyMember.js";
import { STORAGE_KEYS } from "../utils/constants.js";

export class FamilyService {
  constructor(storage) {
    this.storage = storage;
  }

  getAll() {
    return this.storage.get(STORAGE_KEYS.members).filter((member) => member.isActive !== false);
  }

  save(data) {
    const members = this.storage.get(STORAGE_KEYS.members);
    const member = new FamilyMember(data);
    const index = members.findIndex((item) => item.id === member.id);
    if (index >= 0) members[index] = { ...members[index], ...member };
    else members.push(member);
    this.storage.set(STORAGE_KEYS.members, members);
    return member;
  }

  remove(id) {
    const members = this.storage.get(STORAGE_KEYS.members).map((member) =>
      member.id === id ? { ...member, isActive: false } : member
    );
    this.storage.set(STORAGE_KEYS.members, members);
  }
}
