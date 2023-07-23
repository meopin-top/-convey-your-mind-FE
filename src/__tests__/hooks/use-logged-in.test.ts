import {renderHook} from "@testing-library/react-hooks"
import {useRouter} from "next/navigation"
import {useNeedLoggedIn, useNeedNotLoggedIn} from "@/hooks/use-logged-in"
import ROUTE from "@/constants/route"
import {createLocalStorageMock} from "@/__mocks__/window"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// renderHook이 useLayoutEffect 이후의 결과를 반환해서 state 초기값에 대한 expect는 작성하지 못함

describe("useNeedLoggedIn", () => {
  let windowAlertMock: jest.SpyInstance
  let routerPushMock: jest.SpyInstance = jest.fn()

  beforeEach(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it("로그인되지 않았다면 alert을 노출하고 MAIN로 리다이렉트되어야 한다.", () => {
    // given, when
    renderHook(() => useNeedLoggedIn())

    // then
    expect(windowAlertMock).toHaveBeenCalled()
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("로그인되지 않았다면 리다이렉트 여부로 true를 반환해야 한다.", () => {
    // given, when
    const {result: isRedirecting} = renderHook(() => useNeedLoggedIn())

    // then
    expect(isRedirecting.current).toBeTruthy()
  })

  it("로그인되었다면 alert을 노출하지 않고 MAIN로 리다이렉트되지 않아야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    renderHook(() => useNeedLoggedIn())

    // then
    expect(windowAlertMock).not.toHaveBeenCalled()
    expect(routerPushMock).not.toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("로그인되었다면 리다이렉트 여부로 false를 반환해야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    const {result: isRedirecting} = renderHook(() => useNeedLoggedIn())

    // then
    expect(isRedirecting.current).toBeFalsy()
  })
})

describe("useNeedNotLoggedIn", () => {
  let routerPushMock: jest.SpyInstance = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it("로그인되지 않았다면 MY_PAGE로 리다이렉트되지 않아야 한다.", () => {
    // given, when
    renderHook(() => useNeedNotLoggedIn())

    // then
    expect(routerPushMock).not.toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("로그인되지 않았다면 리다이렉트 여부로 false를 반환해야 한다.", () => {
    // given, when
    const {result: isRedirecting} = renderHook(() => useNeedNotLoggedIn())

    // then
    expect(isRedirecting.current).toBeFalsy()
  })

  it("로그인되었다면 MY_PAGE로 리다이렉트되어야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    renderHook(() => useNeedNotLoggedIn())

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("로그인되었다면 리다이렉트 여부로 true를 반환해야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    const {result: isRedirecting} = renderHook(() => useNeedNotLoggedIn())

    // then
    expect(isRedirecting.current).toBeTruthy()
  })
})
