import {render, screen} from "@testing-library/react"
import Progress from "@/components/rolling-paper/creation/Progress"

describe("Progress", () => {
  it("프로그래스 바가 올바르게 표시된다.", () => {
    // given, when
    const totalCount = 10
    const doneCount = 3
    render(<Progress totalCount={totalCount} doneCount={doneCount} />)

    const progressBarElement = screen.getByRole("progressbar").childNodes[0]

    // then
    expect(progressBarElement).toHaveStyle(
      `width: ${(doneCount * 100) / totalCount}%;`
    )
  })
})
