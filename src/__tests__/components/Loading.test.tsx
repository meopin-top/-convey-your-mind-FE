import type {HTMLAttributes} from "react"
import {render, screen, fireEvent, act} from "@testing-library/react"
import Loading, {type TProps} from "@/components/Loading"

jest.mock("../../assets/icons/spinner.svg", () => ({
  __esModule: true,
  default: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>spinner</svg>
  ),
}))
jest.mock("../../assets/icons/close.svg", () => ({
  __esModule: true,
  default: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>close</svg>
  ),
}))

function renderLoading({
  isLoading,
  testid = "loading-wrapper",
  ...props
}: TProps & {testid?: string}) {
  render(<Loading isLoading={isLoading} data-testid={testid} {...props} />)
}

const testid = "loading-wrapper"

describe("without onClose 버튼", () => {
  it("로딩 중이 아니면 아무것도 렌더링하지 않는다", () => {
    // given, when
    renderLoading({isLoading: false})
    const wrapper = screen.queryByTestId(testid)

    // then
    expect(wrapper).not.toBeInTheDocument()
  })

  it("로딩 중이라면 spinner를 렌더링한다.", () => {
    // given, when
    renderLoading({isLoading: true})
    const spinner = screen.getByRole("status")

    // then
    expect(spinner).toBeInTheDocument()
  })

  it("props로 blur가 true로 전달되면 wrapper는 blur 클래스를 가지게 된다.", () => {
    // given, when
    renderLoading({isLoading: true, blur: true})
    const wrapper = screen.getByTestId(testid)

    // then
    expect(wrapper).toHaveClass("blur")
  })

  it("props로 blur가 전달되지 않으면 wrapper는 blur 클래스를 가지지 않는다.", () => {
    // given, when
    renderLoading({isLoading: true})
    const wrapper = screen.getByTestId(testid)

    // then
    expect(wrapper).not.toHaveClass("blur")
  })
})

describe("with onClose 버튼", () => {
  it("로딩 중이라도 props로 onClose가 전달되지 않으면 close 버튼을 렌더링하지 않는다.", () => {
    // given, when
    renderLoading({isLoading: true})
    const closeButton = screen.queryByRole("button")

    // then
    expect(closeButton).not.toBeInTheDocument()
  })

  it("props로 onClose가 전달되면 close 버튼을 렌더링한다.", () => {
    // given, when
    const onClose = jest.fn()
    renderLoading({isLoading: true, onClose})
    const closeButton = screen.getByRole("button")

    // then
    expect(closeButton).toBeInTheDocument()
  })

  it("close 버튼이 눌리면 props로 전달된 onClose가 실행된다.", () => {
    // given
    const onClose = jest.fn()
    renderLoading({isLoading: true, onClose})
    const closeButton = screen.getByRole("button")

    // when
    fireEvent.click(closeButton)

    // then
    expect(onClose).toHaveBeenCalled()
  })

  it("props로 onClose가 전달되지 않으면, 전달된 duration이 지난 이후에도 close 버튼이 렌더링되지 않는다.", () => {
    // given
    jest.useFakeTimers()

    const duration = 2000
    renderLoading({isLoading: true, duration})
    const closeButton = screen.queryByRole("button")

    // when
    act(() => {
      jest.advanceTimersByTime(duration)
    })

    // then
    expect(closeButton).not.toBeInTheDocument()
  })

  it("props로 onClose가 전달되고, duration이 지나기 전에는 close 버튼이 화면에 보이지 않는다.", () => {
    // given
    const onClose = jest.fn()
    renderLoading({isLoading: true, onClose})
    const closeButton = screen.getByRole("button")

    // then
    expect(closeButton).not.toHaveClass("show")
    expect(closeButton).toHaveClass("hide")
  })

  it("props로 onClose가 전달되고, 전달된 duration이 지난 이후에 close 버튼이 화면에 보인다.", () => {
    // given
    jest.useFakeTimers()

    const onClose = jest.fn()
    const duration = 2000
    renderLoading({isLoading: true, duration, onClose})
    const closeButton = screen.getByRole("button")

    // when
    act(() => {
      jest.advanceTimersByTime(duration)
    })

    // then
    expect(closeButton).toHaveClass("show")
    expect(closeButton).not.toHaveClass("hide")
  })
})
