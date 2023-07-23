import {renderHook} from "@testing-library/react-hooks"
import {useRouter} from "next/navigation"
import {useNeedLoggedIn, useNeedNotLoggedIn} from "@/hooks/use-logged-in"
import ROUTE from "@/constants/route"
import {createLocalStorageMock} from "@/__mocks__/store"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

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

  it("로그인되지 않았다면 alert을 노출하고 MAIN route로 redirect 되어야 한다.", () => {
    // given, when
    renderHook(() => useNeedLoggedIn())

    // then
    expect(windowAlertMock).toHaveBeenCalled()
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("로그인되었다면 alert을 노출하지 않고 MAIN route로 redirect 되지 않아야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    renderHook(() => useNeedLoggedIn())

    // then
    expect(windowAlertMock).not.toHaveBeenCalled()
    expect(routerPushMock).not.toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("페인트 여부를 반환해야 한다.", () => {
    // renderHook이 setState 이후의 결과를 반환해서 이전 state에 대한 expect는 작성하지 못함

    // given, when
    const {result: isPainted} = renderHook(() => useNeedLoggedIn())

    // then
    expect(isPainted.current).toBeTruthy()
  })
})

describe("useNeedLoggedIn", () => {
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

  it("로그인되지 않았다면 MY_PAGE route로 redirect 되지 않아야 한다.", () => {
    // given, when
    renderHook(() => useNeedNotLoggedIn())

    // then
    expect(routerPushMock).not.toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("로그인되었다면 MY_PAGE route로 redirect 되어야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    renderHook(() => useNeedNotLoggedIn())

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("페인트 여부를 반환해야 한다.", () => {
    // renderHook이 setState 이후의 결과를 반환해서 이전 state에 대한 expect는 작성하지 못함

    // given, when
    const {result: isPainted} = renderHook(() => useNeedLoggedIn())

    // then
    expect(isPainted.current).toBeTruthy()
  })
})
