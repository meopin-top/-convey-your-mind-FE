import type {MouseEvent} from "react"
import useWheelScroll from "@/hooks/use-wheel-scroll"
import {createScrollBy, removeScrollBy} from "@/__mocks__/window"

describe("useWheelScroll", () => {
  beforeAll(() => {
    createScrollBy()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    removeScrollBy()
  })

  test("마우스 휠 버튼을 누른 상태로 마우스가 이동하면 스크롤이 이동한다.", () => {
    // given
    const mouseEventMock = {
      button: 1,
      movementX: 10,
      movementY: 10,
      preventDefault: jest.fn(),
    } as unknown as MouseEvent

    const {handleMouseDown, handleMouseMove} = useWheelScroll()

    // when
    handleMouseDown(mouseEventMock)
    handleMouseMove(mouseEventMock)

    // then
    expect(window.scrollBy).toHaveBeenCalledWith(-10, -10)
  })

  test("휠 외의 마우스 버튼을 클릭했을 때 스크롤이 이동하지 않는다.", () => {
    // given
    const mouseEventMock = {
      button: 0,
    } as MouseEvent

    const {handleMouseDown, handleMouseMove} = useWheelScroll()

    // when
    handleMouseDown(mouseEventMock)
    handleMouseMove(mouseEventMock)

    // then
    expect(window.scrollBy).not.toHaveBeenCalled()
  })
})
