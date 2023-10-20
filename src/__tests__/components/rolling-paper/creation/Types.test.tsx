import {render, screen} from "@testing-library/react"
import Types from "@/components/rolling-paper/creation/Types"

describe("Types", () => {
  it("올바르게 컴포넌트를 렌더링한다.", () => {
    // given, when
    render(<Types />)

    const description = screen.getByText("어떤 롤링페이퍼를 만들까요?")

    const typeD = screen.getByText(/큰 종이에.*자유롭게 편지쓰기/)
    const typeUndefined1 = screen.getByText(/포스트잇으로.*깔끔하게 만들기/)
    const typeUndefined2 = screen.getByText(/어드벤트 캘린더로.*만들기/)
    const typeUndefined3 = screen.getByText(/내 맘대로.*커스텀 하기/)

    // then
    expect(description).toBeInTheDocument()
    expect(typeD).toBeInTheDocument()
    expect(typeUndefined1).toBeInTheDocument()
    expect(typeUndefined2).toBeInTheDocument()
    expect(typeUndefined3).toBeInTheDocument()
  })

  // https://github.com/jsdom/jsdom/issues/1245
  // js-dom에 innerText가 구현되어있지 않아서 아래 내용은 테스트 불가능
  // it("isReady가 true인 타입을 클릭하면 active 상태가 된다.", () => {})

  // it("isReady가 false인 타입을 클릭하면 type이 선택되지 않는다.", () => {})
})
