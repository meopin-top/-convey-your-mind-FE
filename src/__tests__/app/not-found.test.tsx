import {render, screen} from "@testing-library/react"
import NotFound from "@/app/not-found"
import {createAlertMock} from "@/__mocks__/window"

describe("not-found", () => {
  beforeEach(() => {
    createAlertMock()
  })

  it("이미지가 올바르게 렌더링된다.", () => {
    // given, when
    render(<NotFound />)

    const image = screen.getByAltText("존재하지 않는 페이지입니다.")

    // then
    expect(image).toBeInTheDocument()
  })

  it("window.alert가 호출된다.", () => {
    render(<NotFound />)

    expect(window.alert).toHaveBeenCalledTimes(1)
  })
})
