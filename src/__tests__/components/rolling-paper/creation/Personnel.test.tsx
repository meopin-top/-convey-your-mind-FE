import {render, screen, fireEvent} from "@testing-library/react"
import Personnel from "@/components/rolling-paper/creation/Personnel"
import type {TProps} from "@/components/Portal"

jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TProps) => render(),
}))

describe("Personnel", () => {
  it("올바르게 컴포넌트를 렌더링한다.", () => {
    // given, when
    const personnel = "5"

    render(<Personnel personnel={personnel} handlePersonnel={jest.fn()} />)

    const description = screen.getByText("롤링페이퍼 참여 인원은 몇 명인가요?")
    const input = screen.getByDisplayValue(personnel)

    // then
    expect(description).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it("인풋 값이 바뀌면 handleToWhom을 호출한다.", () => {
    // given
    const personnel = "5"
    const handlePersonnel = jest.fn()

    render(
      <Personnel personnel={personnel} handlePersonnel={handlePersonnel} />
    )

    const input = screen.getByDisplayValue(personnel) as HTMLInputElement

    // when
    fireEvent.change(input, {target: {value: "10"}})

    // then
    expect(handlePersonnel).toHaveBeenCalledTimes(1)
  })

  it("'미정' 버튼을 누르면 Alert가 렌더링된다.", () => {
    // given
    render(<Personnel personnel={"5"} handlePersonnel={jest.fn()} />)

    const undefinedButton = screen.getByRole("button", {name: "미정"})

    // when
    fireEvent.click(undefinedButton)

    // then
    const alert = screen.getByText(/롤링페이퍼 참여 인원이 미정일 경우/i)
    expect(alert).toBeInTheDocument()
  })

  it("Alert가 렌더링된 이후 '확정하기' 버튼을 누르면 Alert가 사라진다.", () => {
    // given
    render(<Personnel personnel={"5"} handlePersonnel={jest.fn()} />)

    const undefinedButton = screen.getByRole("button", {name: "미정"})
    fireEvent.click(undefinedButton)

    const alert = screen.getByText(/롤링페이퍼 참여 인원이 미정일 경우/i)
    const confirmButton = screen.getByRole("button", {name: "확정하기"})

    // then
    fireEvent.click(confirmButton)

    // Assert
    expect(alert).not.toBeInTheDocument()
  })

  it("Alert가 렌더링된 이후 '취소' 버튼을 누르면 Alert가 사라진다.", () => {
    // given
    render(<Personnel personnel={"5"} handlePersonnel={jest.fn()} />)

    const undefinedButton = screen.getByRole("button", {name: "미정"})
    fireEvent.click(undefinedButton)

    const alert = screen.getByText(/롤링페이퍼 참여 인원이 미정일 경우/i)
    const cancelButton = screen.getByRole("button", {name: "취소"})

    // then
    fireEvent.click(cancelButton)

    // Assert
    expect(alert).not.toBeInTheDocument()
  })
})
