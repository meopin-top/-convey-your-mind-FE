import {render, screen} from "@testing-library/react"
import CreationSuccess from "@/app/rolling-paper/creation/[sharingCode]/page"
import ROUTE from "@/constants/route"

jest.mock(
  "../../../../components/rolling-paper/creation/[sharingCode]/Sharing",
  () => ({
    __esModule: true,
    default: () => <></>,
  })
)

describe("CreationSuccess", () => {
  it("올바르게 렌더링한다.", () => {
    // given, when
    render(<CreationSuccess params={{sharingCode: "test"}} />)

    const title = screen.getByText("롤링페이퍼 만들기")
    const rollingPaperButton = screen.getByRole("button", {
      name: "롤링 페이퍼 쓰러 가기",
    })
    const myPageButton = screen.getByRole("button", {
      name: "마이 페이지",
    })

    // then
    expect(title).toBeInTheDocument()
    expect(rollingPaperButton).toBeInTheDocument()
    expect(myPageButton).toBeInTheDocument()
  })

  it("'롤링 페이퍼 쓰러 가기' 버튼을 누르면 로그인 페이지로 이동한다.", () => {
    // given, when
    render(<CreationSuccess params={{sharingCode: "test"}} />)

    const rollingPaperButtonAnchor = screen
      .getByRole("button", {
        name: "롤링 페이퍼 쓰러 가기",
      })
      .querySelector(":first-child")

    // then
    expect(rollingPaperButtonAnchor).toHaveAttribute("href", `${ROUTE.LOGIN}`)
  })

  it("'마이 페이지' 버튼을 누르면 로그인 페이지로 이동한다.", () => {
    // given, when
    render(<CreationSuccess params={{sharingCode: "test"}} />)

    const rollingPaperButtonAnchor = screen
      .getByRole("button", {
        name: "마이 페이지",
      })
      .querySelector(":first-child")

    // then
    expect(rollingPaperButtonAnchor).toHaveAttribute("href", `${ROUTE.LOGIN}`)
  })
})
