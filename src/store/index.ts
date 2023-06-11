export default class Storage {
  static #instance: Storage

  constructor() {
    if (Storage.#instance) {
      return Storage.#instance
    }

    Storage.#instance = this
  }

  get(key: string) {
    return localStorage.getItem(key) || "저장된 데이터가 없습니다"
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value)
  }
}
