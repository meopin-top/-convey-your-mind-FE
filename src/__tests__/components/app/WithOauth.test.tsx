import {render, screen} from "@testing-library/react"
import WithOauth from "@/components/app/WithOauth"

describe("WithOauth", () => {
  it("가이드를 올바르게 렌더링한다.", () => {
    // given, when
    render(<WithOauth />)
    const guideText = screen.getByText("EASY하게 롤링페이퍼 관리하기")

    // then
    expect(guideText).toBeInTheDocument()
  })

  it("카카오 로그인으로 바로가기를 올바르게 렌더링한다.", () => {
    // given, when
    render(<WithOauth />)
    const kakaoSection = screen.getByText("카카오 로그인")
    const kakaoLogo = screen.getByAltText("카카오톡 로고")

    // then
    expect(kakaoSection).toBeInTheDocument()
    expect(kakaoLogo).toBeInTheDocument()
  })

  it("네이버 로그인으로 바로가기를 올바르게 렌더링한다.", () => {
    // given, when
    render(<WithOauth />)
    const emailSection = screen.getByText("네이버 로그인")
    const emailLogo = screen.getByAltText("네이버 로고")

    // then
    expect(emailSection).toBeInTheDocument()
    expect(emailLogo).toBeInTheDocument()
  })
})
