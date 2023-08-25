import {render, screen} from "@testing-library/react"
import NotFound from "@/app/not-found"

describe("not-found", () => {
  it("wrapper가 올바르게 렌더링된다.", () => {
    // given, when
    render(<NotFound />)

    const wrapper = screen.getByText("존재하지 않는 페이지입니다.")

    // then
    expect(wrapper).toBeInTheDocument()
  })
})
