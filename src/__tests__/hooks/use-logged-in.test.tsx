import {render, screen} from "@testing-library/react"
import {useRouter} from "next/navigation"
import {useNeedLoggedIn, useNeedNotLoggedIn} from "@/hooks/use-logged-in"
import {ROUTE} from "@/constants/service"
import {createLocalStorageMock, createAlertMock} from "@/__mocks__/window"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// renderHook이 useLayoutEffect 이후의 결과를 반환해서 state 초기값에 대한 expect는 작성하지 못함

const IS_REDIRECTING = "O"
const IS_NOT_REDIRECTING = "X"

describe("useNeedLoggedIn", () => {
  let routerPushMock: jest.SpyInstance = jest.fn()

  const NeedLoggedInComponent = () => {
    const redirecting = useNeedLoggedIn()

    return <>{redirecting ? IS_REDIRECTING : IS_NOT_REDIRECTING}</>
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })
    createAlertMock()
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it("로그인되지 않았다면 alert을 노출하고 MAIN로 리다이렉트되어야 한다.", () => {
    // given, when
    render(<NeedLoggedInComponent />)

    // then
    expect(window.alert).toHaveBeenCalled()
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("로그인되지 않았다면 리다이렉트 여부로 true를 반환해야 한다.", () => {
    // given, when
    render(<NeedLoggedInComponent />)

    // then
    const isRedirecting = screen.getByText(IS_REDIRECTING)

    expect(isRedirecting).toBeInTheDocument()
  })

  it("로그인되었다면 alert을 노출하지 않고 MAIN로 리다이렉트되지 않아야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    render(<NeedLoggedInComponent />)

    // then
    expect(window.alert).not.toHaveBeenCalled()
    expect(routerPushMock).not.toHaveBeenCalledWith(ROUTE.MAIN)
  })

  it("로그인되었다면 리다이렉트 여부로 false를 반환해야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    render(<NeedLoggedInComponent />)

    // then
    const isNotRedirecting = screen.getByText(IS_NOT_REDIRECTING)

    expect(isNotRedirecting).toBeInTheDocument()
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

  const NeedNotLoggedInComponent = () => {
    const redirecting = useNeedNotLoggedIn()

    return <>{redirecting ? IS_REDIRECTING : IS_NOT_REDIRECTING}</>
  }

  it("로그인되지 않았다면 MY_PAGE로 리다이렉트되지 않아야 한다.", () => {
    // given, when
    render(<NeedNotLoggedInComponent />)

    // then
    expect(routerPushMock).not.toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("로그인되지 않았다면 리다이렉트 여부로 false를 반환해야 한다.", () => {
    // given, when
    render(<NeedNotLoggedInComponent />)

    // then
    const isNotRedirecting = screen.getByText(IS_NOT_REDIRECTING)

    expect(isNotRedirecting).toBeInTheDocument()
  })

  it("로그인되었다면 MY_PAGE로 리다이렉트되어야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    render(<NeedNotLoggedInComponent />)

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("로그인되었다면 리다이렉트 여부로 true를 반환해야 한다.", () => {
    // given, when
    window.localStorage.setItem("nickName", "something")

    render(<NeedNotLoggedInComponent />)

    // then
    const isRedirecting = screen.getByText(IS_REDIRECTING)

    expect(isRedirecting).toBeInTheDocument()
  })
})
