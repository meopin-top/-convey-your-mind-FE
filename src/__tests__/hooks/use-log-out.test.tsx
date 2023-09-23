import {render, screen, fireEvent} from "@testing-library/react"
import useLogOut from "@/hooks/use-log-out"
import ROUTE from "@/constants/route"
import {createLocalStorageMock, createFetchMock} from "@/__mocks__/window"

const fetchMock = jest.fn()
const routerPushMock = jest.fn()

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: routerPushMock,
  }),
}))

const TestComponent = () => {
  const logOut = useLogOut()

  return <button onClick={logOut}>로그아웃 버튼</button>
}

describe("useLogOut", () => {
  beforeAll(() => {
    createLocalStorageMock()
    createFetchMock(fetchMock)
  })

  afterEach(() => {
    window.localStorage.clear()
    jest.clearAllMocks()
  })

  it("logOut 함수가 호출되면 Storage에 저장된 유저 데이터가 삭제된다.", () => {
    // given
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
  })

  it("logOut 함수가 호출되면 메인 화면으로 이동한다.", () => {
    // given
    render(<TestComponent />)

    const logOutButton = screen.getByRole("button", {name: "로그아웃 버튼"})

    // when
    fireEvent.click(logOutButton)

    // then

    expect(routerPushMock).toBeCalledWith(ROUTE.MAIN)
  })

  it("logOut 함수가 호출되면 API를 호출한다.", () => {
    // given
    render(<TestComponent />)

    const logOutButton = screen.getByRole("button", {name: "로그아웃 버튼"})

    // when
    fireEvent.click(logOutButton)

    // then
    expect(fetchMock).toBeCalled()
  })
})
