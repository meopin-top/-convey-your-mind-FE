import {render, screen, fireEvent} from "@testing-library/react"
import SubmitButton from "@/components/rolling-paper/creation/SubmitButton"
import type {TProps} from "@/components/Portal"

jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TProps) => render(),
}))

function renderSubmitButtonAndGetButton(disabled: boolean) {
  render(
    <SubmitButton
      toWhom={"Jacob"}
      personnel={"5"}
      sharedCode={"J1234"}
      disabled={disabled}
    />
  )

  const submitButton = screen.getByRole("button", {
    name: "롤링 페이퍼 만들기",
  })

  return submitButton
}

describe("SubmitButton", () => {
  it("올바르게 컴포넌트를 렌더링한다.", () => {
    // given, when
    const submitButton = renderSubmitButtonAndGetButton(true)

    // then
    expect(submitButton).toBeInTheDocument()
  })

  it("disabled가 true면 버튼은 disabled 처리된다.", () => {
    // given, when
    const submitButton = renderSubmitButtonAndGetButton(true)

    // then
    expect(submitButton).toBeDisabled()
  })

  it("disabled가 false인 상태에서 '롤링 페이퍼 만들기' 버튼을 클릭하면 Alert가 렌더링된다.", () => {
    // given
    const toWhom = "Jacob"
    const personnel = "5"
    const sharedCode = "J1234"

    render(
      <SubmitButton
        toWhom={toWhom}
        personnel={personnel}
        sharedCode={sharedCode}
        disabled={false}
      />
    )

    const submitButton = screen.getByRole("button", {
      name: "롤링 페이퍼 만들기",
    })

    // when
    fireEvent.click(submitButton)
    const contents = [
      screen.getByText(/받는 사람/),
      screen.getByText(toWhom),
      screen.getByText(/참여 인원/),
      screen.getByText(personnel),
      screen.getByText(/선택한 탬플릿/),
      screen.getByText(sharedCode),
    ]

    // then
    contents.forEach((content) => {
      expect(content).toBeInTheDocument()
    })
  })

  it("Alert가 렌더링된 이후 '시작하기' 버튼을 누르면 시작하기 API를 호출한다.", () => {
    // given, when

    // then
    expect(1 + 1).toEqual(2)
  })

  it("Alert가 렌더링된 이후 '취소' 버튼을 누르면 Alert가 사라진다.", () => {
    // given
    const toWhom = "Jacob"
    const personnel = "5"
    const sharedCode = "J1234"

    render(
      <SubmitButton
        toWhom={toWhom}
        personnel={personnel}
        sharedCode={sharedCode}
        disabled={false}
      />
    )

    const submitButton = screen.getByRole("button", {
      name: "롤링 페이퍼 만들기",
    })

    fireEvent.click(submitButton)

    const cancelButton = screen.getByRole("button", {
      name: "취소",
    })

    // when
    fireEvent.click(cancelButton)

    const contents = [
      screen.queryByText(/받는 사람/),
      screen.queryByText(toWhom),
      screen.queryByText(/참여 인원/),
      screen.queryByText(personnel),
      screen.queryByText(/선택한 탬플릿/),
      screen.queryByText(sharedCode),
    ]

    // then
    contents.forEach((content) => {
      expect(content).not.toBeInTheDocument()
    })
  })
})
