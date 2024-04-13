import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import Component from "@/components/rolling-paper/edit/Canvas"
import type {TProps as TPortalProps} from "@/components/Portal"
import {FakeMouseEvent} from "@/__mocks__/event"
import {removeVisualViewport} from "@/__mocks__/window"

const requestMock = jest.fn()

jest.mock("../../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
  }),
}))
jest.mock("../../../../../hooks/use-wheel-scroll.ts", () => ({
  __esModule: true,
  default: () => ({
    handleMouseDown: jest.fn(),
    handleMouseMove: jest.fn(),
    handleMouseUp: jest.fn(),
  }),
}))
jest.mock("../../../../../hooks/use-rolling-paper-socket.ts", () => ({
  __esModule: true,
  default: () => ({
    send: jest.fn(),
    isContentSendingError: false,
    closeContentSendingError: jest.fn(),
  }),
}))
jest.mock("../../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock(
  "../../../../../components/rolling-paper/edit/TextContent.tsx",
  () => ({
    __esModule: true,
    default: ({
      isBottomSheetOpen,
      onComplete,
    }: {
      isBottomSheetOpen: boolean
      onComplete: (sender: string, text: string) => void
    }) => (
      <>
        <div>text bottom sheet {isBottomSheetOpen ? "open" : "close"} </div>
        <button type="button" onClick={() => onComplete("sender", "text")}>
          draw text preview
        </button>
      </>
    ),
  })
)
jest.mock(
  "../../../../../components/rolling-paper/edit/ImageContent.tsx",
  () => ({
    __esModule: true,
    default: ({isBottomSheetOpen}: {isBottomSheetOpen: boolean}) => (
      <div>image bottom sheet {isBottomSheetOpen ? "open" : "close"} </div>
    ),
  })
)

const PROJECT_ID = "abcd"
const TO_WHOM = "receiver"
const TYPE = "D"

const Canvas = () => {
  return (
    <div className="root-wrapper">
      <Component projectId={PROJECT_ID} toWhom={TO_WHOM} type={TYPE} />
    </div>
  )
}

describe("Canvas", () => {
  beforeEach(() => {
    ;(window as any).visualViewport = {
      width: 0,
    }
  })

  afterEach(() => {
    removeVisualViewport()
  })

  it("컴포넌트 렌더링 후 입장을 기록하기 위한 API를 호출한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<Canvas />)
    })

    // then
    expect(requestMock).toHaveBeenCalledWith({
      path: `/projects/${PROJECT_ID}/enter`,
      method: "post",
    })
  })

  it("contentPreview가 없을 때 캔버스 빈 화면을 클릭하면 툴팁이 노출된다.", async () => {
    // given
    await waitFor(() => {
      render(<Canvas />)
    })

    const canvas = document.querySelector(`.type-${TYPE}`) as HTMLDivElement

    // when
    fireEvent(canvas, new FakeMouseEvent("click", {pageY: 0, pageX: 0}))

    // then
    const textContentButton = screen.getByRole("button", {name: "편지 쓰기"})
    const imageContentButton = screen.getByRole("button", {name: "사진 넣기"})

    expect(textContentButton).toBeInTheDocument()
    expect(imageContentButton).toBeInTheDocument()
  })

  it("툴팁의 '편지 쓰기' 버튼을 누르면 텍스트 컨텐츠를 입력할 수 있는 바텀 시트가 오픈된다.", async () => {
    // given, when
    await waitFor(() => {
      render(<Canvas />)
    })

    const canvas = document.querySelector(`.type-${TYPE}`) as HTMLDivElement
    let textContentBottomSheet = screen.getByText(/text bottom sheet close/)

    // then
    expect(textContentBottomSheet).toBeInTheDocument()

    // when
    fireEvent(canvas, new FakeMouseEvent("click", {pageY: 0, pageX: 0}))

    const textContentButton = screen.getByRole("button", {name: "편지 쓰기"})

    fireEvent.click(textContentButton)

    // then
    textContentBottomSheet = screen.getByText(/text bottom sheet open/)

    expect(textContentBottomSheet).toBeInTheDocument()
  })

  it("툴팁의 '사진 넣기' 버튼을 누르면 이미지 컨텐츠를 입력할 수 있는 바텀 시트가 오픈된다.", async () => {
    // given, when
    await waitFor(() => {
      render(<Canvas />)
    })

    const canvas = document.querySelector(`.type-${TYPE}`) as HTMLDivElement
    let textContentBottomSheet = screen.getByText(/image bottom sheet close/)

    // then
    expect(textContentBottomSheet).toBeInTheDocument()

    // when
    fireEvent(canvas, new FakeMouseEvent("click", {pageY: 0, pageX: 0}))

    const imageContentButton = screen.getByRole("button", {name: "사진 넣기"})

    fireEvent.click(imageContentButton)

    // then
    textContentBottomSheet = screen.getByText(/image bottom sheet open/)

    expect(textContentBottomSheet).toBeInTheDocument()
  })

  it("text contentPreview가 있을 때 캔버스 빈 화면을 클릭하면 입력한 컨텐츠가 사라질 수 있다는 경고 얼럿이 노출된다.", async () => {
    // given
    await waitFor(() => {
      render(<Canvas />)
    })

    const button = screen.getByRole("button", {name: "draw text preview"})
    const canvas = document.querySelector(`.type-${TYPE}`) as HTMLDivElement

    fireEvent.click(button)

    // when
    fireEvent.click(canvas)

    // then
    const flowAlert = screen.getByText(/편집 중인 컨텐츠는 저장되지 않습니다./)

    expect(flowAlert).toBeInTheDocument()
  })

  it("image contentPreview가 있을 때 캔버스 빈 화면을 클릭하면 입력한 컨텐츠가 사라질 수 있다는 경고 얼럿이 노출된다.", async () => {
    // TODO
  })

  it("입력한 컨텐츠가 사라질 수 있다는 경고 얼럿의 '취소' 버튼을 누르면 경고 얼럿이 닫힌다.", async () => {
    // given
    await waitFor(() => {
      render(<Canvas />)
    })

    const button = screen.getByRole("button", {name: "draw text preview"})
    const canvas = document.querySelector(`.type-${TYPE}`) as HTMLDivElement

    // when
    fireEvent.click(button)
    fireEvent.click(canvas)

    const cancelButton = screen.getByRole("button", {name: "취소"})

    // then
    expect(cancelButton).toBeInTheDocument()

    // when
    fireEvent.click(cancelButton)

    // then
    const flowAlert = screen.queryByText(
      /편집 중인 컨텐츠는 저장되지 않습니다./
    )

    expect(flowAlert).not.toBeInTheDocument()
  })

  it("입력한 컨텐츠가 사라질 수 있다는 경고 얼럿의 '확인' 버튼을 누르면 새로운 툴팁이 노출되며, 경고 얼럿이 닫힌다.", async () => {
    // given
    await waitFor(() => {
      render(<Canvas />)
    })

    const button = screen.getByRole("button", {name: "draw text preview"})
    const canvas = document.querySelector(`.type-${TYPE}`) as HTMLDivElement

    // when
    fireEvent.click(button)
    fireEvent(canvas, new FakeMouseEvent("click", {pageY: 0, pageX: 0}))

    const okButton = screen.getByRole("button", {name: "확인"})

    // then
    expect(okButton).toBeInTheDocument()

    // when
    fireEvent.click(okButton)

    // then
    const flowAlert = screen.queryByText(
      /편집 중인 컨텐츠는 저장되지 않습니다./
    )
    const textContentButton = screen.getByRole("button", {name: "편지 쓰기"})
    const imageContentButton = screen.getByRole("button", {name: "사진 넣기"})

    expect(flowAlert).not.toBeInTheDocument()
    expect(textContentButton).toBeInTheDocument()
    expect(imageContentButton).toBeInTheDocument()
  })
})
