import {renderHook} from "@testing-library/react-hooks"
import {redirect} from "next/navigation"
import {useNeedLoggedIn, useNeedNotLoggedIn} from "@/hooks/use-logged-in"
import ROUTE from "@/constants/route"
import {createLocalStorageMock} from "@/__mocks__/store"

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

describe("useNeedLoggedIn", () => {
  let windowAlertMock: jest.SpyInstance

  beforeEach(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it("로그인되지 않았다면 alert을 노출하고 MAIN route로 redirect 되어야 한다.", () => {
    // given, when
    renderHook(() => useNeedLoggedIn())

    // then
    expect(windowAlertMock).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("로그인되었다면 alert을 노출하지 않고 MAIN route로 redirect 되지 않아야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    renderHook(() => useNeedLoggedIn())

    // then
    expect(windowAlertMock).not.toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalledWith(ROUTE.MAIN)
  })
})

describe("useNeedLoggedIn", () => {
  beforeEach(() => {
    createLocalStorageMock()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it("로그인되지 않았다면 MY_PAGE route로 redirect 되지 않아야 한다.", () => {
    // given, when
    renderHook(() => useNeedNotLoggedIn())

    // then
    expect(redirect).not.toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("로그인되었다면 MY_PAGE route로 redirect 되어야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    renderHook(() => useNeedNotLoggedIn())

    // then
    expect(redirect).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })
})
