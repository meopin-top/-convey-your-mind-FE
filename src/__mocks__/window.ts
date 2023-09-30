type TStorage = {[key: string]: string}

export function createLocalStorageMock(storage: TStorage = {}) {
  const localStorageMock = (function () {
    let store: TStorage = storage

    return {
      getItem: jest.fn((key: string) => store[key] ?? null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value.toString()
      }),
      removeItem: jest.fn((key: string) => {
        const result = key in store

        delete store[key]

        return result
      }),
      clear: jest.fn(() => {
        store = {}
      }),
    }
  })()

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    configurable: true,
  })
}

export function removeLocalStorageMock() {
  delete (window.localStorage as {getItem: any}).getItem
  delete (window.localStorage as {setItem: any}).setItem
  delete (window.localStorage as {removeItem: any}).removeItem
  delete (window.localStorage as {clear: any}).clear
}

export function createWriteTextMock() {
  Object.defineProperty(window.navigator, "clipboard", {
    value: {
      writeText: jest.fn(() => Promise.resolve(undefined)),
    },
    configurable: true,
  })
}

export function removeCreateWriteTextMock() {
  delete (window.navigator.clipboard as {writeText: any}).writeText
}

export function createShareMock() {
  Object.defineProperty(window.navigator, "share", {
    value: jest.fn(() => Promise.resolve(undefined)),
    configurable: true,
  })
}

export function removeShareMock() {
  delete (window.navigator as {share: any}).share
}
