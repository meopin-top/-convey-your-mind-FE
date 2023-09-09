import {render, screen, fireEvent} from "@testing-library/react"
import type {HTMLAttributes} from "react"
import NavigationBar from "@/components/NavigationBar"
// import ROUTE from "@/constants/route"
import type {TProps} from "@/components/my/UserInformation"

const lockScrollMock = jest.fn()
const unlockScrollMock = jest.fn()
jest.mock("../../hooks/use-body-scroll-lock.ts", () => ({
  __esModule: true,
  default: () => ({
    lockScroll: lockScrollMock,
    unlockScroll: unlockScrollMock,
  }),
}))

jest.mock("../../components/my/UserInformation.tsx", () => ({
  __esModule: true,
  default: ({right}: TProps) => <div>{right}</div>,
}))

jest.mock("../../assets/icons", () => ({
  __esModule: true,
  Hamburger: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>hamburger</svg>
  ),
  Close: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>close</svg>
  ),
  UserCircle: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>user circle</svg>
  ),
  WritePaper: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>write paper</svg>
  ),
  LoveLetter: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>love letter</svg>
  ),
  Paper: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>paper</svg>
  ),
  Bulb: ({...rest}: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...rest}>bulb</svg>
  ),
}))

describe("NavigationBar", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("햄버거 메뉴와 네비게이션 바가 렌더링된다.", () => {
    // given, when
    render(<NavigationBar />)

    const hamburger = screen.getByText("hamburger")
    const navigationBar = screen.getByRole("navigation")

    // then
    expect(hamburger).toBeInTheDocument()
    expect(navigationBar).toBeInTheDocument()
  })

  it("햄버거 메뉴를 누르면 네비게이션 바가 open된다.", () => {
    // given
    render(<NavigationBar />)

    const hamburger = screen.getByText("hamburger")
    const navigationBar = screen.getByRole("navigation")

    // when
    fireEvent.click(hamburger)

    // then
    expect(navigationBar.classList).toContain("open")
  })

  it("네비게이션 바가 open되어 있을 때 background를 누르면 네비게이션 바가 close된다.", () => {
    // given
    render(<NavigationBar />)

    const hamburger = screen.getByText("hamburger")
    const navigationBarAndBackground = screen.getByRole("navigation")

    // when
    fireEvent.click(hamburger)
    fireEvent.click(navigationBarAndBackground)

    // then
    expect(navigationBarAndBackground.classList).toContain("close")
  })

  it("네비게이션 바가 open되어 있을 때 close 버튼을 누르면 네비게이션 바가 close된다.", () => {
    // given
    render(<NavigationBar />)

    const hamburger = screen.getByText("hamburger")
    const navigationBar = screen.getByRole("navigation")
    const close = screen.getByText("close")

    // when
    fireEvent.click(hamburger)
    fireEvent.click(close)

    // then
    expect(navigationBar.classList).toContain("close")
  })

  it("초기에는 scroll이 unlock 상태이다.", () => {
    // given, when
    render(<NavigationBar />)

    // then
    expect(unlockScrollMock).toBeCalledTimes(1)
  })

  it("네비게이션 바가 open되면 scroll이 lock 상태이다.", () => {
    // given
    render(<NavigationBar />)

    const hamburger = screen.getByText("hamburger")

    // when
    fireEvent.click(hamburger)

    // then
    expect(lockScrollMock).toBeCalledTimes(1)
  })

  it("네비게이션 바가 close 되면 scroll이 unlock 상태이다.", () => {
    // given
    render(<NavigationBar />)

    const hamburger = screen.getByText("hamburger")
    const close = screen.getByText("close")

    // when
    fireEvent.click(hamburger)
    fireEvent.click(close)

    // then
    expect(unlockScrollMock).toBeCalledTimes(2)
  })

  // it("로그인되지 않았을 때 회원가입과 로그인 버튼이 노출된다.", () => {

  // })

  // it("로그인되었을 때 회원 프로필과 로그아웃 버튼이 노출된다.", () => {

  // })

  // it("로그아웃 버튼을 누르면 로그아웃 API가 호출된다.", () => {

  // })

  // it("미로그인 시 마이페이지 링크를 누르면 alert가 호출된다.", () => {

  // })

  // it("로그인 시 마이페이지 링크를 누르면 마이페이지로 이동한다.", () => {

  // })

  // it("미로그인 시 참여 중인 프로젝트 링크를 누르면 alert가 호출된다.", () => {

  // })

  // it("로그인 시 참여 중인 프로젝트 링크를 누르면 참여 중인 프로젝트로 이동한다.", () => {

  // })

  // it("미로그인 시 내가 받은 롤링페이퍼 링크를 누르면 alert가 호출된다.", () => {

  // })

  // it("로그인 시 내가 받은 롤링페이퍼 링크를 누르면 내가 받은 롤링페이퍼로 이동한다.", () => {

  // })

  // it("미로그인 시 롤링페이퍼 만들기 링크를 누르면 alert가 호출된다.", () => {

  // })

  // it("로그인 시 롤링페이퍼 만들기 링크를 누르면 롤링페이퍼 만들기로 이동한다.", () => {

  // })

  // it("FAQ 링크를 누르면 FAQ로 이동한다.", () => {

  // })

  // it("고객센터 문의 링크를 누르면 고객센터 문의로 이동한다.", () => {

  // })
})
