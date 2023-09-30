import {render, screen} from "@testing-library/react"
import RollingPaperCreation from "@/app/rolling-paper/creation/page"

describe("RollingPaperCreation", () => {
  it("제목을 렌더링한다", () => {
    // given, when
    render(<RollingPaperCreation />)
    const title = screen.getByText("롤링페이퍼 시작하기")

    // then
    expect(title).toBeInTheDocument()
  })
})
