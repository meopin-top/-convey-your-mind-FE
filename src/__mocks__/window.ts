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
  })
}

export function createWriteTextMock() {
  Object.defineProperty(window.navigator, "clipboard", {
    value: {
      writeText: jest.fn(() => Promise.resolve(undefined)),
    },
  })
}
