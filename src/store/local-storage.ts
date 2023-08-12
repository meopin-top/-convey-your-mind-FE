import type {TLocalStorageKey} from "@/@types/storage"

export default class Storage {
  static get(key: TLocalStorageKey) {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key)
    }

    return null
  }

  static set(key: TLocalStorageKey, value: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value)
    }
  }

  static remove(key: TLocalStorageKey): boolean {
    if (typeof window !== "undefined" && localStorage.getItem(key)) {
      localStorage.removeItem(key)

      return true
    }

    return false
  }
}
