import {render, screen, fireEvent} from "@testing-library/react"
import WithoutSignUp from "@/components/app/WithoutSignUp"

describe("WithoutSignUp", () => {
  it("공유코드 state를 올바르게 변경한다.", () => {
    // given
    render(<WithoutSignUp />)
    const sharedCodeInput = screen.getByPlaceholderText(
      "공유코드로 바로 편지쓰기"
    ) as HTMLInputElement
    const value = "test"

    // when
    fireEvent.change(sharedCodeInput, {target: {value}})

    // then
    expect(sharedCodeInput.value).toEqual(value)
  })
})
