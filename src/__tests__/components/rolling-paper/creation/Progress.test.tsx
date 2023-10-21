import {render, screen} from "@testing-library/react"
import Progress from "@/components/rolling-paper/creation/Progress"

const TOTAL_STEP = 5
const DONE_STEP = 3

jest.mock("react", () => ({
  __esModule: true,
  ...jest.requireActual("react"),
  useContext: () => ({
    doneStep: {
      WHOM: true,
      PERSONNEL: true,
      TYPE: true,
      DUE_DATE: false,
      SHARING_CODE: false,
    },
  }),
}))

describe("Progress", () => {
  it("프로그래스 바가 올바르게 표시된다.", () => {
    // given, when
    render(<Progress totalCount={TOTAL_STEP} />)

    const progressBarElement = screen.getByRole("progressbar").childNodes[0]

    // then
    expect(progressBarElement).toHaveStyle(
      `width: ${(DONE_STEP * 100) / TOTAL_STEP}%;`
    )
  })
})
