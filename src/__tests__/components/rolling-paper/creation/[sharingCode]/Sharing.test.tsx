import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import Sharing from "@/components/rolling-paper/creation/[sharingCode]/Sharing"
import {
  createShareMock,
  createWriteTextMock,
  removeCreateWriteTextMock,
  removeShareMock,
} from "@/__mocks__/window"

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <img src="" alt="test" />,
}))
jest.mock("../../../../../assets/icons/index.ts", () => ({
  __esModule: true,
  ClipboardCheck: () => <svg>clipboard-check</svg>,
  Clipboard: () => <svg>clipboard</svg>,
  Share: () => <svg>share</svg>,
}))
jest.mock("../../../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <div>loading</div>,
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

  it("'공유하기' 버튼을 누르기 전에는 Share 아이콘을 렌더링한다.", () => {
    // given, when
    render(<Sharing sharingCode="test" />)
    const sharingButton = screen.getByRole("button", {
      name: /공유하기/,
    })
    const sharingIcon = screen.getByText("share")

    // then
    expect(sharingButton).toBeInTheDocument
    expect(sharingIcon).toBeInTheDocument()
  })

  it("'navigator.share'가 정의되어 있으면 'navigator.share'이 호출된다.", async () => {
    // given
    createShareMock()

    render(<Sharing sharingCode="test" />)

    const sharingButton = screen.getByRole("button", {
      name: /공유하기/,
    })

    // when
    fireEvent.click(sharingButton)

    // then
    await waitFor(() => {
      expect(window.navigator.share).toBeCalled()

      removeShareMock()
    })
  })

  it("'navigator.share가 정의되어 있지 않다면 'alert'가 호출된다.", async () => {
    // given
    const windowAlertMock: jest.SpyInstance = jest
      .spyOn(window, "alert")
      .mockImplementation()

    render(<Sharing sharingCode="test" />)

    const sharingButton = screen.getByRole("button", {
      name: /공유하기/,
    })

    // when
    fireEvent.click(sharingButton)

    // then
    await waitFor(() => {
      expect(windowAlertMock).toBeCalled()

      windowAlertMock.mockRestore()
    })
  })

  it("'공유하기' 기능이 끝난 뒤에는 다시 Share 아이콘을 렌더링한다.", async () => {
    // given
    jest.spyOn(window, "alert").mockImplementation()

    render(<Sharing sharingCode="test" />)
    const sharingButton = screen.getByRole("button", {
      name: /공유하기/,
    })

    // when
    fireEvent.click(sharingButton)

    // then
    const loadingComponent = screen.queryByText("loading")
    const sharingIcon = await screen.findByText("share")

    expect(loadingComponent).not.toBeInTheDocument()
    expect(sharingIcon).toBeInTheDocument()
  })
})
