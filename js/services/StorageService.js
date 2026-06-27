export class StorageService {
  constructor(storage = window.localStorage) {
    this.storage = storage;
  }

  get(key, fallback = []) {
    try {
      const raw = this.storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }
}
