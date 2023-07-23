import {render, waitFor} from "@testing-library/react"
import {redirect} from "next/navigation"
import OauthMiddleware from "@/app/oauth-middleware/page"
import {SIGN_IN} from "@/constants/response-code"
import ROUTE from "@/constants/route"
import {createLocalStorageMock} from "@/__mocks__/window"

const requestMock = jest.fn()
const getSearchParamsMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => ({
    get: getSearchParamsMock,
  }),
  redirect: jest.fn(),
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

describe("OAuthMiddleware", () => {
  let windowAlertMock: jest.SpyInstance

  beforeAll(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    windowAlertMock.mockRestore()
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
      expect(redirect).toHaveBeenCalledTimes(1)
      expect(redirect).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    })
  })

  it("네이버 로그인에 성공하면 API 요청 후 MY_PAGE로 리다이렉트되어야 한다.", async () => {
    // given, when
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
      expect(redirect).toHaveBeenCalledTimes(1)
      expect(redirect).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    })
  })

  it("Oauth에 실패하면 alert 호출 후 MAIN으로 리다이렉트되어야 한다.", async () => {
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

    // then
    await waitFor(() => {
      expect(redirect).toHaveBeenCalledTimes(1)
      expect(redirect).toHaveBeenCalledWith(ROUTE.MAIN)
      expect(windowAlertMock).toHaveBeenCalledTimes(1)
    })
  })
})
