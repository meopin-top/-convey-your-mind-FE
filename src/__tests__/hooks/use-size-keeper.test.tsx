import {render, screen, act} from "@testing-library/react"
import useSizeKeeper from "@/hooks/use-size-keeper"
import {removeVisualViewport} from "@/__mocks__/window"

const beforeHeight = 1000
const beforeSizes = [100, 200, 300]
const afterHeight = 1200 // 1.2배
const afterSizes = [120, 240, 360] // 1.2배
const offsetTop = 10
const offsetLeft = 20
const width = 800
const positionText = `${offsetTop} / ${offsetLeft} / ${width}`

const Component = () => {
  const {sizes, position} = useSizeKeeper(beforeSizes)

  return (
    <>
      <div>{sizes.map((size) => size.toString()).join(" / ")}</div>
      <div>{`${position.top} / ${position.left} / ${position.width}`}</div>
    </>
  )
}

jest.mock("../../utils/optimization.ts", () => ({
  __esModule: true,
  debounce: (callback: (...args: any) => any) => callback,
}))

describe("useSizeKeeper", () => {
  beforeEach(() => {
    ;(window as any).visualViewport = {
      height: beforeHeight,
      offsetTop,
      offsetLeft,
      width,
    }
  })

  afterEach(() => {
    removeVisualViewport()
  })

  it("resize 이벤트가 발생하면 화면 변화 비율에 따라 크기가 변하며 visualViewport의 포지션을 반환한다.", () => {
    // given
    render(<Component />)

    // when
    act(() => {
      ;(window as any).visualViewport.height = afterHeight
      window.dispatchEvent(new Event("resize"))
    })

    // then
    const sizes = screen.getByText(
      afterSizes.map((size) => size.toString()).join(" / ")
    )
    const position = screen.getByText(positionText)

    expect(sizes).toBeInTheDocument()
    expect(position).toBeInTheDocument()
  })

  it("touchmove 이벤트가 발생하면 화면 변화 비율에 따라 크기가 변하며 visualViewport의 포지션을 반환한다(pinch zoom).", () => {
    // given
    render(<Component />)

    // when
    act(() => {
      ;(window as any).visualViewport.height = afterHeight
      const touchEvent = new TouchEvent("touchmove", {
        touches: [
          {
            identifier: 1,
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            force: 0,
            radiusX: 0,
            radiusY: 0,
            rotationAngle: 0,
            screenX: 0,
            screenY: 0,
            target: new EventTarget(),
          },
          {
            identifier: 2,
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            force: 0,
            radiusX: 0,
            radiusY: 0,
            rotationAngle: 0,
            screenX: 0,
            screenY: 0,
            target: new EventTarget(),
          },
        ],
      })
      window.dispatchEvent(touchEvent)
    })

    // then
    const sizes = screen.getByText(
      afterSizes.map((size) => size.toString()).join(" / ")
    )
    const position = screen.getByText(positionText)

    expect(sizes).toBeInTheDocument()
    expect(position).toBeInTheDocument()
  })

  it("wheel 이벤트가 발생하면 화면 변화 비율에 따라 크기가 변하며 visualViewport의 포지션을 반환한다.", () => {
    // given
    render(<Component />)

    // when
    act(() => {
      ;(window as any).visualViewport.height = afterHeight
      window.dispatchEvent(new Event("wheel"))
    })

    // then
    const sizes = screen.getByText(
      afterSizes.map((size) => size.toString()).join(" / ")
    )
    const position = screen.getByText(positionText)

    expect(sizes).toBeInTheDocument()
    expect(position).toBeInTheDocument()
  })
})
