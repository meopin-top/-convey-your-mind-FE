import {render, screen, fireEvent} from "@testing-library/react"
import {useRouter} from "next/navigation"
import LoginAlert from "@/components/LoginAlert"
import ROUTE from "@/constants/route"

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

describe("LoginAlert", () => {
  it("isAlerting props가 false이면 아무것도 렌더링하지 않는다.", () => {
    // given, when
    render(<LoginAlert isAlerting={false} onClose={jest.fn()} />)

    const content = screen.queryByText(/로그인하시겠습니까?/)
    const cancelButton = screen.queryByRole("button", {
      name: "취소",
    })
    const goToSignInButton = screen.queryByRole("button", {
      name: "확인",
    })

    // then
    expect(content).not.toBeInTheDocument()
    expect(cancelButton).not.toBeInTheDocument()
    expect(goToSignInButton).not.toBeInTheDocument()
  })

  it("isAlerting props가 true이면 내용과 버튼을 올바르게 렌더링한다.", () => {
    // given, when
    render(<LoginAlert isAlerting onClose={jest.fn()} />)

    const content = screen.getByText(/로그인하시겠습니까?/)
    const cancelButton = screen.getByRole("button", {
      name: "취소",
    })
    const goToSignInButton = screen.getByRole("button", {
      name: "확인",
    })

    // then
    expect(content).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
    expect(goToSignInButton).toBeInTheDocument()
  })

  it("취소 버튼을 누르면 onClose가 호출된다.", () => {
    // given
    const onCloseMock = jest.fn()
    render(<LoginAlert isAlerting onClose={onCloseMock} />)

    const cancelButton = screen.getByRole("button", {
      name: "취소",
    })

    // when
    fireEvent.click(cancelButton)

    // then
    expect(onCloseMock).toBeCalled()
  })

  it("확인 버튼을 누르면 메인 화면으로 이동한다", () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })

    const onCloseMock = jest.fn()
    render(<LoginAlert isAlerting onClose={onCloseMock} />)

    const goToSignInButton = screen.getByRole("button", {
      name: "확인",
    })

    // when
    fireEvent.click(goToSignInButton)

    // then
    expect(routerPushMock).toHaveBeenCalledTimes(1)
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MAIN)
  })
})
