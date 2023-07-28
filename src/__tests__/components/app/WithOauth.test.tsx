import {fireEvent, render, screen} from "@testing-library/react"
import {useRouter} from "next/navigation"
import WithOauth from "@/components/app/WithOauth"
import ROUTE from "@/constants/route"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("WithOauth", () => {
  it("가이드를 올바르게 렌더링한다.", () => {
    // given, when
    render(<WithOauth />)

    const guideText = screen.queryByText("EASY하게 롤링페이퍼 관리하기")

    // then
    expect(guideText).toBeInTheDocument()
  })

  it("카카오 로그인 버튼이 올바르게 렌더링한다.", () => {
    // given, when
    render(<WithOauth />)

    const kakaoSection = screen.queryByText("카카오 로그인")
    const kakaoLogo = screen.queryByAltText("카카오 로고")
    const kakaoLoginButton = kakaoLogo!.closest("button")

    // then
    expect(kakaoSection).toBeInTheDocument()
    expect(kakaoLogo).toBeInTheDocument()
    expect(kakaoLoginButton).toBeInTheDocument()
  })

  it("네이버 로그인 버튼이 올바르게 렌더링한다.", () => {
    // given, when
    render(<WithOauth />)

    const naverSection = screen.queryByText("네이버 로그인")
    const naverLogo = screen.queryByAltText("네이버 로고")
    const naverLoginButton = naverLogo!.closest("button")

    // then
    expect(naverSection).toBeInTheDocument()
    expect(naverLogo).toBeInTheDocument()
    expect(naverLoginButton).toBeInTheDocument()
  })

  it("카카오 로그인 버튼 클릭 시 카카오 로그인 페이지로 이동한다.", () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })

    render(<WithOauth />)

    const kakaoLoginButton = screen
      .getByAltText("카카오 로고")
      .closest("button") as HTMLButtonElement

    // when
    fireEvent.click(kakaoLoginButton)

    // then
    expect(routerPushMock).toBeCalledWith(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_HOST}${ROUTE.OAUTH_MIDDLEWARE}&response_type=code`
    )
  })

  it("네이버 로그인 버튼 클릭 시 네이버 로그인 페이지로 이동한다.", () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })

    render(<WithOauth />)

    const naverLoginButton = screen
      .getByAltText("네이버 로고")
      .closest("button") as HTMLButtonElement

    // when
    fireEvent.click(naverLoginButton)

    // then
    expect(routerPushMock).toBeCalledWith(
      `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&state=${process.env.NEXT_PUBLIC_NAVER_STATE}&redirect_uri=${process.env.NEXT_PUBLIC_HOST}${ROUTE.OAUTH_MIDDLEWARE}&response_type=code`
    )
  })
})
