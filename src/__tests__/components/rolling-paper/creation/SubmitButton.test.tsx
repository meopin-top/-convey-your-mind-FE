import {render, screen, fireEvent} from "@testing-library/react"
import Component from "@/components/rolling-paper/creation/SubmitButton"
import {
  Provider,
  DDayProvider,
} from "@/components/rolling-paper/creation/Context"
import {isBefore} from "@/utils/date"
import type {TProps} from "@/components/Portal"

jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TProps) => render(),
}))
jest.mock(
  "../../../../components/rolling-paper/creation/ConfirmedPopUp.tsx",
  () => ({
    __esModule: true,
    default: ({isAlerting}: {isAlerting: boolean}) => (
      <>ConfirmedPopUp {isAlerting ? "open" : "close"}</>
    ),
  })
)
jest.mock("../../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>ErrorAlert {isAlerting ? "open" : "close"}</>
  ),
}))
jest.mock("../../../../utils/date.ts", () => ({
  __esModule: true,
  ...jest.requireActual("../../../../utils/date.ts"),
  isBefore: jest.fn(),
}))

const SubmitButton = ({totalStep = 5}: {totalStep?: number}) => {
  return (
    <Provider>
      <DDayProvider>
        <Component totalStep={totalStep} />
      </DDayProvider>
    </Provider>
  )
}

describe("SubmitButton", () => {
  it("올바르게 컴포넌트를 렌더링한다.", async () => {
    // given, when
    render(<SubmitButton />)

    const submitButton = screen.getByRole("button", {
      name: "롤링페이퍼 만들기",
    })
    const confirmedPopUp = await screen.findByText(/ConfirmedPopUp close/)
    const errorAlert = await screen.findByText(/ErrorAlert close/)

    // then
    expect(submitButton).toBeInTheDocument()
    expect(confirmedPopUp).toBeInTheDocument()
    expect(errorAlert).toBeInTheDocument()
  })

  it("totalStep과 DONE_COUNT가 다르면 '롤링페이퍼 만들기' 버튼은 disabled 상태가 된다.", () => {
    // given, when
    render(<SubmitButton totalStep={5} />)

    const submitButton = screen.getByRole("button", {
      name: "롤링페이퍼 만들기",
    })

    // then
    expect(submitButton).toBeDisabled()
  })

  it("totalStep과 DONE_COUNT가 같으면 '롤링페이퍼 만들기' 버튼은 disabled 상태가 아니다.", () => {
    // given, when
    render(<SubmitButton totalStep={1} />)

    const submitButton = screen.getByRole("button", {
      name: "롤링페이퍼 만들기",
    })

    // then
    expect(submitButton).not.toBeDisabled()
  })

  it("'롤링페이퍼 만들기'을 클릭할 때 D-day가 현재 날짜보다 이전이면 ErrorAlert를 렌더링한다.", async () => {
    // given
    ;(isBefore as jest.Mock).mockReturnValueOnce(true)

    render(<SubmitButton totalStep={1} />)

    const submitButton = screen.getByRole("button", {
      name: "롤링페이퍼 만들기",
    })

    // when
    fireEvent.click(submitButton)

    // then
    const confirmedPopUp = await screen.findByText(/ConfirmedPopUp close/)
    const errorAlert = await screen.findByText(/ErrorAlert open/)

    expect(confirmedPopUp).toBeInTheDocument()
    expect(errorAlert).toBeInTheDocument()
  })

  it("'롤링페이퍼 만들기'을 클릭할 때 D-day가 현재 날짜보다 미래면 ConfirmedPopUp을 렌더링한다.", async () => {
    // given
    ;(isBefore as jest.Mock).mockReturnValueOnce(false)

    render(<SubmitButton totalStep={1} />)

    const submitButton = screen.getByRole("button", {
      name: "롤링페이퍼 만들기",
    })

    // when
    fireEvent.click(submitButton)

    // then
    const confirmedPopUp = await screen.findByText(/ConfirmedPopUp open/)
    const errorAlert = await screen.findByText(/ErrorAlert close/)

    expect(confirmedPopUp).toBeInTheDocument()
    expect(errorAlert).toBeInTheDocument()
  })
})
