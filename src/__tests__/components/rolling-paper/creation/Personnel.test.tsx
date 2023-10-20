import {render, screen, fireEvent} from "@testing-library/react"
import Component from "@/components/rolling-paper/creation/Personnel"
import {PersonnelProvider} from "@/components/rolling-paper/creation/Context"
import type {TProps} from "@/components/Portal"

const Personnel = () => {
  return (
    <PersonnelProvider>
      <Component />
    </PersonnelProvider>
  )
}

jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TProps) => render()
}))

describe("Personnel", () => {
  it("올바르게 컴포넌트를 렌더링한다.", () => {
    // given, when
    render(<Personnel />)

    const description = screen.getByText("롤링페이퍼 참여 인원은 몇 명인가요?")
    const input = screen.getByDisplayValue("")

    // then
    expect(description).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it("1 ~ 9999 사이 값을 입력하면 personnel 값이 변경된다.", () => {
    // given
    const VALUE = "10"

    render(<Personnel />)

    const input = screen.getByDisplayValue("") as HTMLInputElement

    // when
    fireEvent.change(input, {
      target: {value: VALUE}
    })

    // then
    expect(input.value).toEqual(VALUE)
  })

  it("1 ~ 9999 외의 값을 입력하면 personnel 값이 변경되지 않는다.", () => {
    // given
    const VALUE = "10000"

    render(<Personnel />)

    const input = screen.getByDisplayValue("") as HTMLInputElement

    // when
    fireEvent.change(input, {
      target: {value: VALUE}
    })

    // then
    expect(input.value).not.toEqual(VALUE)
  })

  it("'미정' 버튼을 누르면 Alert가 렌더링된다.", () => {
    // given
    render(<Personnel />)

    const undefinedButton = screen.getByRole("button", {name: "미정"})

    // when
    fireEvent.click(undefinedButton)

    // then
    const alert = screen.getByText(/롤링페이퍼 참여 인원이 미정일 경우/i)
    expect(alert).toBeInTheDocument()
  })

  it("Alert가 렌더링된 이후 '확정하기' 버튼을 누르면 Alert가 사라진다.", () => {
    // given
    render(<Personnel />)

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
    render(<Personnel />)

    const undeterminedButton = screen.getByRole("button", {name: "미정"})
    fireEvent.click(undeterminedButton)

    const alert = screen.getByText(/롤링페이퍼 참여 인원이 미정일 경우/i)
    const cancelButton = screen.getByRole("button", {name: "취소"})

    // then
    fireEvent.click(cancelButton)

    // Assert
    expect(alert).not.toBeInTheDocument()
  })
})
