import type {TLocalStorageKey} from "@/@types/storage"

export default class Storage {
  static get(key: TLocalStorageKey) {
    return localStorage.getItem(key)
  }

  static set(key: TLocalStorageKey, value: string) {
    localStorage.setItem(key, value)
  }

  static remove(key: TLocalStorageKey): boolean {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)

      return true
    }

    return false
  }
}
