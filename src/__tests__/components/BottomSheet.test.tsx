import {render, fireEvent, screen} from "@testing-library/react"
import BottomSheet from "@/components/BottomSheet"

describe("BottomSheet", () => {
  beforeAll(() => {
    window.addEventListener = jest.fn()
    window.removeEventListener = jest.fn()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it("isHandlingHistory props에 따라 이벤트 리스너 API가 호출되어야 한다.", () => {
    // given, when
    const {unmount} = render(
      <BottomSheet isOpen={true} onClose={jest.fn()} isHandlingHistory={true}>
        Content
      </BottomSheet>
    )

    // then
    expect(window.addEventListener).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    )

    // when
    unmount()

    // then
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    )
  })

  it("배경이 클릭될 때 onClose가 호출되어야 한다.", () => {
    // given
    const onCloseMock = jest.fn()

    render(
      <BottomSheet isOpen={true} onClose={onCloseMock}>
        Content
      </BottomSheet>
    )
    const background = screen.getByRole("article")

    // when
    fireEvent.click(background)

    // then
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
