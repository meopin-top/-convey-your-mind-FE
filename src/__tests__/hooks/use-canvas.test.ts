import {useState} from "react"
import useCanvas from "@/hooks/use-canvas"
import {removeVisualViewport} from "@/__mocks__/window"

const mockDocument = {
  querySelector: jest.fn(),
}

const mockWrapper = document.createElement("div")
mockWrapper.appendChild = jest.fn()
mockWrapper.removeChild = jest.fn()
mockDocument.querySelector.mockReturnValue(mockWrapper)

jest.mock("react", () => ({
  __esModule__: true,
  useState: jest.fn(),
  useEffect: jest.fn(),
}))

describe("useCanvas", () => {
  beforeEach(() => {
    ;(window as any).visualViewport = {
      width: 0,
    }
  })

  afterEach(() => {
    removeVisualViewport()
    jest.clearAllMocks()
  })

  it("createContent는 preview를 그릴 때 wrapper의 자식을 추가해야 한다.", async () => {
    // given
    const mockSetState = jest.fn()

    ;(useState as jest.Mock).mockImplementationOnce(() => [
      mockWrapper,
      mockSetState,
    ])
    ;(useState as jest.Mock).mockImplementationOnce(() => [null, mockSetState])
    ;(useState as jest.Mock).mockImplementationOnce(() => [false, mockSetState])
    ;(useState as jest.Mock).mockImplementationOnce(() => [false, mockSetState])

    // when
    const {createContent} = useCanvas()
    createContent({
      content: {
        sender: "",
        text: "",
      },
      position: {
        pageX: 0,
        pageY: 0,
      },
      isPreview: true,
    })

    // then
    expect(mockWrapper.appendChild).toHaveBeenCalled()
  })

  it("createContent는 preview를 그리지 않을 때 wrapper의 자식을 추가해야 한다.", async () => {
    // given
    const mockSetState = jest.fn()

    ;(useState as jest.Mock).mockImplementationOnce(() => [
      mockWrapper,
      mockSetState,
    ])
    ;(useState as jest.Mock).mockImplementationOnce(() => [null, mockSetState])
    ;(useState as jest.Mock).mockImplementationOnce(() => [false, mockSetState])
    ;(useState as jest.Mock).mockImplementationOnce(() => [false, mockSetState])

    // when
    const {createContent} = useCanvas()
    createContent({
      content: {
        sender: "",
        text: "",
      },
      position: {
        pageX: 0,
        pageY: 0,
      },
      isPreview: false,
    })

    // then
    expect(mockWrapper.appendChild).toHaveBeenCalled()
  })

  it("contentPreview를 생성한 뒤 제거할 때 wrapper의 자식을 제거해야 한다.", () => {
    // given
    const mockSetState = jest.fn()
    const mockContentPreview = document.createElement("div")

    ;(useState as jest.Mock).mockImplementationOnce(() => [
      mockWrapper,
      mockSetState,
    ])
    ;(useState as jest.Mock).mockImplementationOnce(() => [
      mockContentPreview,
      mockSetState,
    ])
    ;(useState as jest.Mock).mockImplementationOnce(() => [false, mockSetState])
    ;(useState as jest.Mock).mockImplementationOnce(() => [false, mockSetState])

    // when
    const {createContent, removeContent} = useCanvas()
    createContent({
      content: {
        sender: "",
        text: "",
      },
      position: {
        pageX: 0,
        pageY: 0,
      },
    })
    removeContent()

    // then
    expect(mockWrapper.removeChild).toHaveBeenCalledWith(mockContentPreview)
  })
})
