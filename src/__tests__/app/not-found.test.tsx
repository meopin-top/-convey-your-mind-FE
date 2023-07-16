import {render, screen} from "@testing-library/react"
import NotFound from "@/app/not-found"

describe("not-found", () => {
  let windowAlertMock: jest.SpyInstance

  beforeEach(() => {
    windowAlertMock = jest.spyOn(window, "alert").mockImplementation()
  })

  afterEach(() => {
    windowAlertMock.mockRestore()
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

    expect(windowAlertMock).toHaveBeenCalledTimes(1)
  })
})
