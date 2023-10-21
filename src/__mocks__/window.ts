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

export function createFetchMock(fetchMock: jest.SpyInstance) {
  Object.defineProperty(window, "fetch", {
    value: fetchMock,
    configurable: true,
  })
}

export function deleteFetchMock() {
  delete (window as any).fetch
}

export function createAlertMock() {
  Object.defineProperty(window, "alert", {
    value: jest.fn(),
    configurable: true,
  })
}

export function createDateMock({
  dateTime = 0,
  delta = 0,
}: {
  dateTime?: number
  delta?: number
}) {
  const dateMock = (function () {
    let i = 0

    return {
      now: jest.fn().mockImplementation(() => dateTime + delta * i++),
    }
  })()

  Object.defineProperty(window, "Date", {
    value: dateMock,
    configurable: true,
  })
}

export function deleteDateMock() {
  delete (window as any).Date
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
