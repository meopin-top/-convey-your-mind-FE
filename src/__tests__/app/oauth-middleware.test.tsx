import {render, screen, waitFor} from "@testing-library/react"
import OauthMiddleware from "@/app/oauth-middleware/page"
import type {TProps as TPortalProps} from "@/components/Portal"
import {SIGN_IN} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"
import {createLocalStorageMock} from "@/__mocks__/window"

const getSearchParamsMock = jest.fn()
const routerReplacementMock = jest.fn()
const requestMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => ({
    get: getSearchParamsMock,
  }),
  useRouter: () => ({
    replace: routerReplacementMock,
  }),
}))
jest.mock("../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
  }),
}))
jest.mock("../../components/Redirecting.tsx", () => ({
  __esModule: true,
  default: () => <div>리다이렉션 중...</div>,
}))
jest.mock("../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>ErrorAlert {isAlerting ? "open" : "close"}</>
  ),
}))

describe("OAuthMiddleware", () => {
  beforeAll(() => {
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    window.localStorage.clear()
  })

  it("카카오 로그인에 성공하면 API 요청 후 MY_PAGE로 리다이렉트되어야 한다.", async () => {
    // given, when
    const nickName = "testNickName"
    const profile = "testProfile"

    const responseMock = {
      code: SIGN_IN.SUCCESS,
      data: {nickName, profile},
    }
    requestMock.mockResolvedValueOnce(responseMock)
    getSearchParamsMock.mockImplementationOnce((parameter: string) => {
      if (parameter === "code") return "kakaoCode"
      return null
    })

    render(<OauthMiddleware />)

    // then
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(2)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "nickName",
        nickName
      )
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "profile",
        profile
      )
      expect(routerReplacementMock).toHaveBeenCalledTimes(1)
      expect(routerReplacementMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    })
  })

  it("네이버 로그인에 성공하면 API 요청 후 MY_PAGE로 리다이렉트되어야 한다.", async () => {
    // given, when
    const nickName = "testNickName"
    const profile = "testProfile"

    const responseMock = {
      code: SIGN_IN.SUCCESS,
      data: {nickName, profile},
    }
    requestMock.mockResolvedValueOnce(responseMock)
    getSearchParamsMock.mockImplementationOnce((parameter: string) => {
      if (parameter === "code") return "naverCode"
      if (parameter === "state") return process.env.NEXT_PUBLIC_NAVER_STATE
      return null
    })

    render(<OauthMiddleware />)

    // then
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(2)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "nickName",
        nickName
      )
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "profile",
        profile
      )
      expect(routerReplacementMock).toHaveBeenCalledTimes(1)
      expect(routerReplacementMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    })
  })

  it("Oauth에 실패하면 ErrorAlert 호출 후 MAIN으로 리다이렉트되어야 한다.", async () => {
    // given, when
    const responseMock = {
      code: "SIGN_IN.FAILURE",
      message: "Failed to sign in.",
      data: null,
    }
    requestMock.mockResolvedValueOnce(responseMock)
    getSearchParamsMock.mockImplementationOnce((parameter: string) => {
      if (parameter === "error") return "error"
      if (parameter === "error_description") return "Failed to sign in."
      return null
    })

    render(<OauthMiddleware />)

    const errorAlert = screen.getByText("ErrorAlert open")

    // then
    await waitFor(() => {
      expect(routerReplacementMock).toHaveBeenCalledTimes(1)
      expect(routerReplacementMock).toHaveBeenCalledWith(ROUTE.MAIN)
      expect(errorAlert).toBeInTheDocument()
    })
  })
})
