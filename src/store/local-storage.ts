import type {TLocalStorageKey} from "@/@types/storage"

export default class Storage {
  static #instance: Storage

  constructor() {
    if (Storage.#instance) {
      return Storage.#instance
    }

    Storage.#instance = this
  }

  get(key: TLocalStorageKey) {
    return localStorage.getItem(key)
  }

  set(key: TLocalStorageKey, value: string) {
    localStorage.setItem(key, value)
  }

  remove(key: TLocalStorageKey): boolean {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)

      return true
    }

    return false
  }
}
