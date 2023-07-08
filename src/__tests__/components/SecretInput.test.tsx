import {render, screen, fireEvent} from "@testing-library/react"
import {SecretInput} from "@/components"

jest.mock("../../assets/icons/index.ts", () => ({
  __esModule: true,
  EyeClose: () => <svg>eye-close</svg>,
  EyeOpen: () => <svg>eye-open</svg>,
}))

describe("SecretInput", () => {
  it("input 타입이 password이며 EyeClose 아이콘을 렌더링한다.", () => {
    // given, when
    const testId = "input"
    render(<SecretInput data-testid={testId} />)

    const input = screen.getByTestId(testId) as HTMLInputElement
    const eyeCloseIcon = screen.getByText("eye-close")

    // then
    expect(input).toBeInTheDocument()
    expect(input.type).toEqual("password")
    expect(eyeCloseIcon).toBeInTheDocument()
  })

  it("EyeClose 아이콘 Wrapper을 누르면 input 타입이 text이며 EyeOpen 아이콘을 렌더링한다.", async () => {
    // given
    render(<SecretInput />)

    const eyeCloseIconWrapper = screen
      .getByText("eye-close")
      .closest("div") as HTMLElement

    // when
    fireEvent.click(eyeCloseIconWrapper)

    const eyeOpenIcon = await screen.findByText("eye-open")

    // then
    expect(eyeOpenIcon).toBeInTheDocument()
  })

  it("input의 값이 올바르게 바뀐다.", () => {
    // given
    const initialValue = "test1"
    const nextValue = "test2"
    const testId = "input"

    render(
      <SecretInput
        defaultValue={initialValue}
        onChange={jest.fn()}
        data-testid={testId}
      />
    )

    const input = screen.getByTestId(testId) as HTMLInputElement

    expect(input.value).toEqual(initialValue)

    // when
    fireEvent.change(input, {
      target: {
        value: nextValue,
      },
    })

    // then
    expect(input.value).toEqual(nextValue)
  })
})
