import {render, screen} from "@testing-library/react"
import Toast from "@/components/Toast"

describe("Toast", () => {
  it("클래스 이름을 올바르게 포함한다.", () => {
    // given, when
    const TOAST_MESSAGE = "test"
    const DURATION = 5

    render(
      <Toast isOpen duration={DURATION}>
        test
      </Toast>
    )

    const toastMessage = screen.getByText(TOAST_MESSAGE)

    // then
    expect(toastMessage.classList).toContain(`out-in-${DURATION}-sec`)
  })
})
