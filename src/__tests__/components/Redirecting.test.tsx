import {fireEvent, render, screen} from "@testing-library/react"
import Redirecting, {type TProps} from "@/components/Redirecting"

const onClickMock = jest.fn()

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <div onClick={onClickMock} role="status" />,
}))
jest.mock("../../assets/gifs/fading-squares.svg", () => ({
  __esModule: true,
  default: () => <></>,
}))

function renderRedirecting({
  isRedirecting,
  testid = "redirecting-wrapper",
  ...props
}: TProps & {testid?: string}) {
  render(
    <Redirecting
      isRedirecting={isRedirecting}
      data-testid={testid}
      {...props}
    />
  )
}

const testid = "redirecting-wrapper"

describe("Redirecting", () => {
  it("리다이렉팅 중이 아니면 아무것도 렌더링하지 않는다", () => {
    // given, when
    renderRedirecting({isRedirecting: false})

    const wrapper = screen.queryByTestId(testid)

    // then
    expect(wrapper).not.toBeInTheDocument()
  })

  it("로딩 중이라면 FadingSquares를 렌더링한다.", () => {
    // given, when
    renderRedirecting({isRedirecting: true})

    const fadingSquares = screen.getByRole("status")

    // then
    expect(fadingSquares).toBeInTheDocument()
  })

  it("props로 blur가 true로 전달되면 wrapper는 blur클래스를 가지게 된다.", () => {
    // given, when
    renderRedirecting({isRedirecting: true, blur: true})

    const wrapper = screen.getByTestId(testid)

    // then
    expect(wrapper).toHaveClass("blur")
  })

  it("props로 blur가 전달되지 않으면 wrapper는 blur클래스를 가지지 않는다.", () => {
    // given, when
    renderRedirecting({isRedirecting: true})

    const wrapper = screen.getByTestId(testid)

    // then
    expect(wrapper).not.toHaveClass("blur")
  })

  it("이벤트가 propagation되지 않아야 한다.", () => {
    // given
    renderRedirecting({isRedirecting: true})

    const wrapper = screen.getByTestId(testid)

    // when
    fireEvent.click(wrapper)

    // then
    expect(onClickMock).not.toHaveBeenCalled()
  })
})
