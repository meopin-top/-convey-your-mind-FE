import {render, screen, fireEvent} from "@testing-library/react"
import type {ReactNode} from "react"
import type {TInputChangeEvent} from "@/hooks/use-input"
import TextContent from "@/components/rolling-paper/edit/TextContent"
import {
  createLocalStorageMock,
  removeLocalStorageMock,
} from "@/__mocks__/window"

jest.mock("../../../../../components/rolling-paper/edit/Content.tsx", () => ({
  __esModule: true,
  default: ({
    children,
    handleSetIsSenderDisabled,
    handleSender,
  }: {
    children: ReactNode
    handleSetIsSenderDisabled: () => void
    handleSender: (event: TInputChangeEvent) => void
  }) => (
    <>
      {children}
      <button onClick={handleSetIsSenderDisabled} data-testid="sender disable">
        sender disable
      </button>
      <input type="text" onChange={handleSender} data-testid="sender input" />
    </>
  ),
}))

describe("TextContent", () => {
  beforeAll(() => {
    createLocalStorageMock()
  })

  afterAll(() => {
    removeLocalStorageMock()
    jest.clearAllMocks()
  })

  it("올바르게 렌더링한다.", () => {
    // given, when
    render(
      <TextContent
        isBottomSheetOpen
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    // then
    const senderEnableButton = screen.getByTestId("sender disable")
    const senderInput = screen.getByTestId("sender input")
    const textArea = screen.getAllByRole("textbox")[0]
    const confirmButton = screen.getByRole("button", {name: "메시지 입력 완료"})

    expect(senderEnableButton).toBeInTheDocument()
    expect(senderInput).toBeInTheDocument()
    expect(textArea).toBeInTheDocument()
    expect(confirmButton).toBeInTheDocument()
  })

  it("텍스트가 입력이 되지 않았다면 입력을 완료하지 못한다.", () => {
    // given, when
    render(
      <TextContent
        isBottomSheetOpen
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    const confirmButton = screen.getByRole("button", {name: "메시지 입력 완료"})

    // then
    expect(confirmButton).toBeDisabled()
  })

  it("발신인 diabled 처리가 되지 않았고, 발신인 입력이 되지 않았다면 입력을 완료하지 못한다.", () => {
    // given
    render(
      <TextContent
        isBottomSheetOpen
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    )

    const senderInput = screen.getByTestId("sender input")
    const confirmButton = screen.getByRole("button", {name: "메시지 입력 완료"})

    // when
    fireEvent.change(senderInput, {target: {value: ""}})

    // then
    expect(confirmButton).toBeDisabled()
  })

  it("텍스트가 입력이 됐고 발신인도 입력이 됐다면 onComplete을 호출할 수 있다.", () => {
    // given
    const onCompleteMock = jest.fn()
    render(
      <TextContent
        isBottomSheetOpen
        onClose={jest.fn()}
        onComplete={onCompleteMock}
      />
    )

    const senderInput = screen.getByTestId("sender input")
    const textArea = screen.getAllByRole("textbox")[0]
    const confirmButton = screen.getByRole("button", {name: "메시지 입력 완료"})

    // when
    fireEvent.change(senderInput, {target: {value: "sender"}})
    fireEvent.change(textArea, {target: {value: "text"}})

    // then
    expect(confirmButton).not.toBeDisabled()

    // when
    fireEvent.click(confirmButton)

    // then
    expect(onCompleteMock).toHaveBeenCalled()
  })

  it("텍스트가 입력이 됐고 발신인을 익명으로 설정한다면 onComplete을 호출할 수 있다.", () => {
    // given
    const onCompleteMock = jest.fn()
    render(
      <TextContent
        isBottomSheetOpen
        onClose={jest.fn()}
        onComplete={onCompleteMock}
      />
    )

    const senderEnableButton = screen.getByTestId("sender disable")
    const textArea = screen.getAllByRole("textbox")[0]
    const confirmButton = screen.getByRole("button", {name: "메시지 입력 완료"})

    // when
    fireEvent.click(senderEnableButton)
    fireEvent.change(textArea, {target: {value: "text"}})

    // then
    expect(confirmButton).not.toBeDisabled()

    // when
    fireEvent.click(confirmButton)

    // then
    expect(onCompleteMock).toHaveBeenCalled()
  })
})
