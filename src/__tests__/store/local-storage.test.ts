import Storage from "@/store/local-storage"
import {createLocalStorageMock} from "@/__mocks__/store"

describe("Storage", () => {
  beforeEach(() => {
    createLocalStorageMock()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it("Storage는 같은 인스턴스를 반환한다(싱글톤).", () => {
    // given, when
    const storage1 = new Storage()
    const storage2 = new Storage()

    // then
    expect(storage1).toBe(storage2)
  })

  it("Storage로부터 key값을 통해 데이터를 저장하고 가져올 수 있다.", () => {
    // given
    const key = "key"
    const value = "value"
    const storage = new Storage()

    // when
    storage.set(key, value)
    const storedValue = storage.get(key)

    // then
    expect(window.localStorage.setItem).toHaveBeenCalledWith(key, value)
    expect(window.localStorage.getItem).toHaveBeenCalledWith(key)
    expect(storedValue).toBe(value)
  })

  it("존재하지 않는 key값으로 조회 요청 시 null 값을 반환한다.", () => {
    // given
    const key = "nonexistentKey"
    const storage = new Storage()

    // when
    const nonExistingValue = storage.get(key)

    // then
    expect(localStorage.getItem).toHaveBeenCalledWith(key)
    expect(nonExistingValue).toBeNull()
  })

  it("존재하지 않는 key값 삭제를 요청할 경우 false를 반환한다.", () => {
    // given
    const key = "nonexistentKey"
    const storage = new Storage()

    // when
    const result = storage.remove(key)

    // then
    expect(window.localStorage.removeItem).not.toHaveBeenCalled()
    expect(result).toBeFalsy()
  })

  it("존재하는 key값 삭제를 요청할 경우 해당 key값을 삭제한 뒤 true를 반환한다.", () => {
    // given
    const key = "key"
    const value = "value"
    const storage = new Storage()

    // when
    storage.set(key, value)
    const result = storage.remove(key)

    // then
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(key)
    expect(result).toBeTruthy()
  })
})
