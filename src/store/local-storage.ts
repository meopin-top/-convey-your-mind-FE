export default class Storage {
  static #instance: Storage

  constructor() {
    if (Storage.#instance) {
      return Storage.#instance
    }

    Storage.#instance = this
  }

  get(key: string) {
    return localStorage.getItem(key)
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value)
  }
}
