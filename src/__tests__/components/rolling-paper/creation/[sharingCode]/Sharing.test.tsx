import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import Sharing from "@/components/rolling-paper/creation/[sharingCode]/Sharing"
import type {TProps as TPortalProps} from "@/components/Portal"
import {
  createShareMock,
  createWriteTextMock,
  removeWriteTextMock,
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
  Bell: () => <svg>bell</svg>,
}))
jest.mock("../../../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <div>loading</div>,
}))
jest.mock("../../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>ErrorAlert {isAlerting ? "open" : "close"}</>
  ),
}))
jest.mock("../../../../../components/Toast.tsx", () => ({
  __esModule: true,
  default: ({isOpen}: {isOpen: boolean}) => (
    <>Toast {isOpen ? "open" : "close"}</>
  ),
}))

describe("Sharing", () => {
  beforeAll(() => {
    createWriteTextMock()
  })

  afterAll(() => {
    removeWriteTextMock()
  })

  it("'URL 복사'가 포함된 버튼을 렌더링한다.", async () => {
    // given, when
    render(<Sharing sharingCode="test" />)

    const copyButton = screen.getByRole("button", {
      name: /URL 복사/,
    })

    // then
    await waitFor(() => {
      expect(copyButton).toBeInTheDocument()
    })
  })

  it("'URL 복사' 버튼을 클릭한 뒤에는 '복사완료' 버튼과 토스트 팝업을 렌더링한다.", async () => {
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
    const toastPopUp = await screen.findByText(/Toast open/)

    expect(copiedButton).toBeInTheDocument()
    expect(toastPopUp).toBeInTheDocument()
  })

  it("일정 시간이 지난 뒤 다시 'URL 복사' 버튼을 렌더링하고 토스트 팝업이 사라진다.", async () => {
    // given
    jest.useFakeTimers()
    render(<Sharing sharingCode="test" />)

    const copyButton = screen.getByRole("button", {
      name: /URL 복사/,
    })
    fireEvent.click(copyButton)

    // when
    jest.advanceTimersByTime(3000)

    // then
    const copyButtonAgain = await screen.findByRole("button", {
      name: /URL 복사/,
    })
    const toastPopUp = await screen.findByText(/Toast close/)

    expect(copyButtonAgain).toBeInTheDocument()
    expect(toastPopUp).toBeInTheDocument()
  })

  it("'공유하기' 버튼을 누르기 전에는 Share 아이콘을 렌더링한다.", () => {
    // given, when
    render(<Sharing sharingCode="test" />)

    const sharingButton = screen.getByRole("button", {
      name: /공유하기/,
    })
    const sharingIcon = screen.getByText("share")

    // then
    expect(sharingButton).toBeInTheDocument()
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
      expect(window.navigator.share).toHaveBeenCalled()

      removeShareMock()
    })
  })

  it("'navigator.share'가 정의되어 있지 않다면 ErrorAlert가 렌더링된다.", async () => {
    // given
    render(<Sharing sharingCode="test" />)

    const sharingButton = screen.getByRole("button", {
      name: /공유하기/,
    })

    // when
    fireEvent.click(sharingButton)

    // then
    const errorAlert = await screen.findByText(/ErrorAlert open/)

    expect(errorAlert).toBeInTheDocument()
  })

  it("'공유하기' 기능이 끝난 뒤에는 다시 Share 아이콘을 렌더링한다.", async () => {
    // given
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
