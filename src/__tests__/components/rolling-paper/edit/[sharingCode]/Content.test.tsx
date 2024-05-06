import type {ReactNode} from "react"
import {render, screen} from "@testing-library/react"
import Store from "@/store/rolling-paper"
import Component from "@/components/rolling-paper/edit/Content"

jest.mock("../../../../../components/BottomSheet.tsx", () => ({
  __esModule: true,
  default: ({children}: {children: ReactNode}) => <>{children}</>,
}))

const Content = ({isSenderDisabled}: {isSenderDisabled: boolean}) => {
  return (
    <Store.Provider value={{toWhom: ""}}>
      <Component
        isBottomSheetOpen
        type="text"
        sender=""
        isSenderDisabled={isSenderDisabled}
        handleIsSenderDisabled={jest.fn()}
        handleSender={jest.fn()}
        onClose={jest.fn()}
      />
    </Store.Provider>
  )
}

describe("Content", () => {
  it("올바르게 렌더링된다.", () => {
    // given, when
    render(<Content isSenderDisabled />)

    // then
    const to = screen.getByText(/To./)
    const from = screen.getByText(/From./)
    const senderInput = screen.getByPlaceholderText("보내는 사람 이름 입력")

    expect(to).toBeInTheDocument()
    expect(from).toBeInTheDocument()
    expect(senderInput).toBeInTheDocument()
  })

  it("sender 입력이 disabled 처리되면 'OFF'를 렌더링한다.", () => {
    // given, when
    render(<Content isSenderDisabled />)

    // then
    const isDisabled = screen.getByText(/OFF/)

    expect(isDisabled)
  })

  it("sender 입력이 disabled 처리되면 'OFF'를 렌더링한다.", () => {
    // given, when
    render(<Content isSenderDisabled={false} />)

    // then
    const isEnabled = screen.getByText(/ON/)

    expect(isEnabled)
  })
})
