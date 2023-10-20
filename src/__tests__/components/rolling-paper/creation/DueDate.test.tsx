import {render, screen, fireEvent} from "@testing-library/react"
import Component from "@/components/rolling-paper/creation/DueDate"
import {DDayProvider} from "@/components/rolling-paper/creation/Context"
import {formatDateTime} from "@/utils/formatter"
import {calculateDateOffset} from "@/utils/date"

const DueDate = () => {
  return (
    <DDayProvider>
      <Component />
    </DDayProvider>
  )
}

describe("DueDate", () => {
  it("description을 올바르게 렌더링한다.", () => {
    // given, when
    render(<DueDate />)

    const description = screen.getByText(/언제까지 롤링페이퍼를 작성하실 건가요/)
    const subDescription = screen.getByText(/롤링페이퍼 전달 예정일을 설정해주세요/)

    // then
    expect(description).toBeInTheDocument()
    expect(subDescription).toBeInTheDocument()
  })

  it("기본적으로 '날짜'가 선택되어 100일 뒤의 date input과 D-day를 렌더링한다.", () => {
    // given, when
    render(<DueDate />)

    const dateLabel = screen.getByText("날짜").closest("label") as HTMLLabelElement
    const dateInput = screen.getByDisplayValue(formatDateTime(calculateDateOffset(100))) as HTMLInputElement
    const dDayText = screen.getByText("(D-100)")

    // then
    expect(dateLabel.classList).toContain("checked")
    expect(dateInput.type).toEqual("date")
    expect(dDayText).toBeInTheDocument()
  })

  it("'D-DAY'를 선택하면 number input과 만료 날짜를 렌더링한다.", () => {
    // given
    render(<DueDate />)

    const dDayLabel = screen.getByText("D-DAY").closest("label") as HTMLLabelElement

    // when
    fireEvent.click(dDayLabel)

    // then
    const dDayInput = screen.getByDisplayValue("100") as HTMLInputElement
    const dueDate = screen.getByText(formatDateTime(calculateDateOffset(100)))

    expect(dDayLabel.classList).toContain("checked")
    expect(dDayInput.type).toEqual("number")
    expect(dueDate).toBeInTheDocument()
  })

  it("'D-DAY' 값으로 1 ~ 9999 사이 값을 입력하면 dDay 값이 변경된다.", () => {
    // given
    const VALUE = "10"

    render(<DueDate />)

    const dDayLabel = screen.getByText("D-DAY").closest("label") as HTMLLabelElement
    fireEvent.click(dDayLabel)

    const dDayInput = screen.getByDisplayValue("100") as HTMLInputElement

    // when
    fireEvent.change(dDayInput, {
      target: {value: VALUE}
    })

    // then
    expect(dDayInput.value).toEqual(VALUE)
  })

  it("'D-DAY' 값으로 1 ~ 9999 외의 값을 입력하면 dDay 값이 변경되지 않는다.", () => {
    // given
    const VALUE = "10000"

    render(<DueDate />)

    const dDayLabel = screen.getByText("D-DAY").closest("label") as HTMLLabelElement
    fireEvent.click(dDayLabel)

    const dDayInput = screen.getByDisplayValue("100") as HTMLInputElement

    // when
    fireEvent.change(dDayInput, {
      target: {value: VALUE}
    })

    // then
    expect(dDayInput.value).not.toEqual(VALUE)
  })

  it("'설정 안 함'을 선택하면 아무런 input을 렌더링하지 않는다.", () => {
    // given
    render(<DueDate />)

    const noneLabel = screen.getByText("설정 안 함").closest("label") as HTMLLabelElement

    // when
    fireEvent.click(noneLabel)

    // then
    const dateInput = screen.queryByDisplayValue(formatDateTime(calculateDateOffset(100))) as HTMLInputElement
    const dDayInput = screen.queryByDisplayValue("100") as HTMLInputElement

    expect(dateInput).not.toBeInTheDocument()
    expect(dDayInput).not.toBeInTheDocument()
  })
})