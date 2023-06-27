import {renderHook} from "@testing-library/react-hooks"
import {useRouter} from "next/navigation"
import ROUTE from "@/constants/route"
import Storage from "@/store/local-storage"
import useNeedLoggedIn from "@/hooks/use-need-logged-in"
import type {TLocalStorageKey} from "@/@types/storage"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("useNeedLoggedIn", () => {
  let windowAlertMock: jest.SpyInstance

  beforeEach(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("로그인되지 않았다면 alert을 노출하고 LOGIN route로 redirect 되어야 한다.", () => {
    const mockRouterReplace = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
    })

    const storageGetMock = jest
      .spyOn(new Storage(), "get")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((_: TLocalStorageKey) => null)

    renderHook(() => useNeedLoggedIn())

    expect(storageGetMock).toHaveBeenCalled()
    expect(windowAlertMock).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith(ROUTE.LOGIN)
  })

  it("로그인되었다면 alert을 노출하지 않고 LOGIN route로 redirect 되지 않아야 한다.", () => {
    const mockRouterReplace = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
    })

    const storageGetMock = jest
      .spyOn(new Storage(), "get")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((_: TLocalStorageKey) => "something")

    renderHook(() => useNeedLoggedIn())

    expect(storageGetMock).toHaveBeenCalled()
    expect(windowAlertMock).not.toHaveBeenCalled()
    expect(mockRouterReplace).not.toHaveBeenCalledWith(ROUTE.LOGIN)
  })
})
