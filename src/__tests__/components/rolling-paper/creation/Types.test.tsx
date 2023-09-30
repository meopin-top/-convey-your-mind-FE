import {render, screen} from "@testing-library/react"
import Types from "@/components/rolling-paper/creation/Types"
import type {TProps} from "@/components/rolling-paper/creation/Type"

jest.mock("../../../../components/rolling-paper/creation/Type.tsx", () => ({
  __esModule: true,
  default: ({children}: TProps) => <div data-testid="type">{children}</div>,
}))

describe("Types", () => {
  it("올바르게 컴포넌트를 렌더링한다.", () => {
    // given, when
    render(<Types />)

    const description = screen.getByText("어떤 롤링페이퍼를 만들까요?")
    const types = screen.getAllByTestId("type")

    // then
    expect(description).toBeInTheDocument()

    expect(types).toHaveLength(4)

    expect(types[0]).toHaveTextContent("큰 종이에")
    expect(types[0]).toHaveTextContent("자유롭게 편지쓰기")

    expect(types[1]).toHaveTextContent("포스트잇으로")
    expect(types[1]).toHaveTextContent("깔끔하게 만들기")

    expect(types[2]).toHaveTextContent("어드벤트 캘린더로")
    expect(types[2]).toHaveTextContent("만들기")

    expect(types[3]).toHaveTextContent("내 맘대로")
    expect(types[3]).toHaveTextContent("커스텀 하기")
  })
})
