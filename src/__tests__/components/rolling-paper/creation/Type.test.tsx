import {render, screen} from "@testing-library/react"
import Type from "@/components/rolling-paper/creation/Type"

describe("Type", () => {
  it("올바르게 컴포넌트를 렌더링한다.", () => {
    // given, when
    const children = "테스트 컴포넌트"
    const recommendationText = "추천 텍스트"

    render(<Type recommendationText={recommendationText}>{children}</Type>)

    const type = screen.getByText(children)
    const recommendation = screen.getByText(recommendationText)

    // then
    expect(type).toBeInTheDocument()
    expect(recommendation).toBeInTheDocument()
  })

  it("준비가 되지 않았으면 'Coming soon' 글자를 렌더링한다.", () => {
    // given, when
    const recommendationText = "추천 텍스트"
    const isReady = false

    render(
      <Type recommendationText={recommendationText} isReady={isReady}>
        children
      </Type>
    )

    const comingSoon = screen.getByText("Coming soon")

    // then
    expect(comingSoon).toBeInTheDocument()
  })
})
