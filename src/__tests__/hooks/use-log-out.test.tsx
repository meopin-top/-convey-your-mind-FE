import {render, screen, fireEvent} from "@testing-library/react"
import {useRouter} from "next/navigation"
import useLogOut from "@/hooks/use-log-out"
import ROUTE from "@/constants/route"
import {createLocalStorageMock} from "@/__mocks__/window"

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

const TestComponent = () => {
  const logOut = useLogOut()

  return <button onClick={logOut}>로그아웃 버튼</button>
}

describe("useLogOut", () => {
  beforeEach(() => {
    createLocalStorageMock()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it("logOut 함수가 호출되면 Storage에 저장된 유저 데이터가 삭제되고, 메인 화면으로 이동한다.", () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    })

    window.localStorage.setItem("nickName", "nickName")
    window.localStorage.setItem("profile", "profile")

    render(<TestComponent />)

    const logOutButton = screen.getByRole("button", {name: "로그아웃 버튼"})

    // when
    fireEvent.click(logOutButton)

    // then
    expect(window.localStorage.removeItem).toBeCalledTimes(2)
    expect(window.localStorage.removeItem).toBeCalledWith("nickName")
    expect(window.localStorage.removeItem).toBeCalledWith("profile")
    expect(routerPushMock).toBeCalledWith(ROUTE.MAIN)
  })
})
