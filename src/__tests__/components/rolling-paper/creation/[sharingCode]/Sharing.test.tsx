import type {HTMLAttributes} from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import Sharing from "@/components/rolling-paper/creation/[sharingCode]/Sharing"
import {
  createWriteTextMock,
  removeCreateWriteTextMock,
} from "@/__mocks__/window"

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <img src="" alt="test" />,
}))
jest.mock("../../../../assets/icons/clipboard-check.svg", () => ({
  __esModule: true,
  default: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>clipboard-check</svg>
  ),
}))
jest.mock("../../../../assets/icons/clipboard.svg", () => ({
  __esModule: true,
  default: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>clipboard</svg>
  ),
}))

describe("Sharing", () => {
  beforeAll(() => {
    createWriteTextMock()
  })

  afterAll(() => {
    removeCreateWriteTextMock()
  })

  it("'URL 복사'가 포함된 버튼을 렌더링한다.", () => {
    // given, when
    render(<Sharing sharingCode="test" />)
    const copyButton = screen.getByRole("button", {
      name: /URL 복사/,
    })
    // then
    expect(copyButton).toBeInTheDocument()
  })

  it("'URL 복사' 버튼을 클릭한 뒤에는 '복사완료' 버튼을 렌더링한다.", async () => {
    // given
    render(<Sharing sharingCode="test" />)
    const copyButton = screen.getByRole("button", {
      name: /URL 복사/,
    })

    // when
    fireEvent.click(copyButton)

    // then
    const copiedButton = await screen.findByRole("button", {
      name: /복사완료/,
    })
    expect(copiedButton).toBeInTheDocument()
  })

  it("일정 시간이 지난 뒤 다시 'URL 복사' 버튼을 렌더링한다.", async () => {
    // given
    jest.useFakeTimers()
    render(<Sharing sharingCode="test" />)

    const copyButton = screen.getByRole("button", {
      name: /URL 복사/,
    })
    fireEvent.click(copyButton)

    // when
    jest.advanceTimersByTime(5000)

    // then
    const copyButtonAgain = await screen.findByRole("button", {
      name: /URL 복사/,
    })
    expect(copyButtonAgain).toBeInTheDocument()
  })
})
