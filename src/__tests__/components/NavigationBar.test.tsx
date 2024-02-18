import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import type {HTMLAttributes} from "react"
import NavigationBar from "@/components/NavigationBar"
import {ROUTE} from "@/constants/service"
import type {TProps as TUserProps} from "@/components/User"
import type {TProps as TPortalProps} from "@/components/Portal"
import {createAlertMock, createLocalStorageMock} from "@/__mocks__/window"

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

const lockScrollMock = jest.fn()
const unlockScrollMock = jest.fn()
jest.mock("../../hooks/use-body-scroll-lock.ts", () => ({
  __esModule: true,
  default: () => ({
    lockScroll: lockScrollMock,
    unlockScroll: unlockScrollMock,
  }),
}))

const logOutMock = jest.fn()
jest.mock("../../hooks/use-log-out.ts", () => ({
  __esModule: true,
  default: () => logOutMock,
}))
jest.mock("../../components/User.tsx", () => ({
  __esModule: true,
  default: ({right}: TUserProps) => (
    <>
      <div>프로필</div>
      <div>{right}</div>
    </>
  ),
}))
jest.mock("../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))
jest.mock("../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>LoginAlert {isAlerting ? "open" : "close"}</>
  ),
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

function login() {
  window.localStorage.setItem("nickName", "nickName")
  window.localStorage.setItem("profile", "profile")
}

describe("NavigationBar", () => {
  beforeAll(() => {
    createAlertMock()
    createLocalStorageMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it("햄버거 메뉴와 네비게이션 바가 렌더링된다.", async () => {
    // given, when
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const hamburger = screen.getByText("hamburger")
    const navigationBar = screen.getByRole("navigation")

    // then
    expect(hamburger).toBeInTheDocument()
    expect(navigationBar).toBeInTheDocument()
  })

  it("햄버거 메뉴를 누르면 네비게이션 바가 open된다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const hamburger = screen.getByText("hamburger")
    const navigationBar = screen.getByRole("navigation")

    // when
    fireEvent.click(hamburger)

    // then
    expect(navigationBar.classList).toContain("open")
  })

  it("네비게이션 바가 open되어 있을 때 background를 누르면 네비게이션 바가 close된다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const hamburger = screen.getByText("hamburger")
    const navigationBarAndBackground = screen.getByRole("navigation")

    // when
    fireEvent.click(hamburger)
    fireEvent.click(navigationBarAndBackground)

    // then
    expect(navigationBarAndBackground.classList).toContain("close")
  })

  it("네비게이션 바가 open되어 있을 때 close 버튼을 누르면 네비게이션 바가 close된다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const hamburger = screen.getByText("hamburger")
    const navigationBar = screen.getByRole("navigation")
    const close = screen.getByText("close")

    // when
    fireEvent.click(hamburger)
    fireEvent.click(close)

    // then
    expect(navigationBar.classList).toContain("close")
  })

  it("네비게이션 바가 open되면 scroll이 lock 상태이다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const hamburger = screen.getByText("hamburger")

    // when
    fireEvent.click(hamburger)

    // then
    expect(lockScrollMock).toHaveBeenCalledTimes(1)
  })

  it("네비게이션 바가 close 되면 scroll이 unlock 상태이다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const hamburger = screen.getByText("hamburger")
    const close = screen.getByText("close")

    // when
    fireEvent.click(hamburger)
    fireEvent.click(close)

    // then
    expect(unlockScrollMock).toHaveBeenCalledTimes(1)
  })

  it("네비게이션 바에 scroll을 제어하지 않으면 scroll이 lock/unlock 되지 않는다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll={false} />)
    })

    const hamburger = screen.getByText("hamburger")
    const close = screen.getByText("close")

    // when
    fireEvent.click(hamburger)
    fireEvent.click(close)

    // then
    expect(lockScrollMock).toHaveBeenCalledTimes(0)
    expect(unlockScrollMock).toHaveBeenCalledTimes(0)
  })

  it("로그인되지 않았을 때 회원가입과 로그인 버튼이 노출된다.", async () => {
    // given, when
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const signUpButton = screen.getByRole("link", {
      name: "회원가입",
    })
    const signInButton = screen.getByRole("link", {
      name: "로그인",
    })

    // then
    expect(signUpButton).toBeInTheDocument()
    expect(signInButton).toBeInTheDocument()
  })

  it("회원가입 버튼을 누르면 메인 페이지로 이동한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const signUpButton = screen.getByRole("link", {
      name: "회원가입",
    }) as HTMLAnchorElement

    // then
    expect(signUpButton.href).toContain(ROUTE.MAIN)
  })

  it("로그인 버튼을 누르면 메인 페이지로 이동한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const signInButton = screen.getByRole("link", {
      name: "로그인",
    }) as HTMLAnchorElement

    // then
    expect(signInButton.href).toContain(ROUTE.MAIN)
  })

  it("로그인되었을 때 회원 프로필과 로그아웃 버튼이 노출된다.", async () => {
    // given, when
    login()

    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const profile = screen.getByText("프로필")
    const logOutButton = screen.getByRole("button", {
      name: "로그아웃",
    })

    // then
    expect(profile).toBeInTheDocument()
    expect(logOutButton).toBeInTheDocument()
  })

  it("로그아웃 버튼을 한 번 누르면 로그아웃 버튼이 disabled 처리된다.", async () => {
    // given
    window.localStorage.setItem("nickName", "nickName")
    window.localStorage.setItem("profile", "profile")

    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const logOutButton = screen.getByRole("button", {
      name: "로그아웃",
    })

    // when
    fireEvent.click(logOutButton)

    // then
    expect(logOutButton).toBeDisabled()
  })

  it("로그아웃 버튼을 누르면 로그아웃 API가 호출된다.", async () => {
    // given
    window.localStorage.setItem("nickName", "nickName")
    window.localStorage.setItem("profile", "profile")

    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const logOutButton = screen.getByRole("button", {
      name: "로그아웃",
    })

    // when
    fireEvent.click(logOutButton)

    // then
    expect(logOutMock).toHaveBeenCalledTimes(1)
  })

  it("미로그인 시 마이페이지 링크를 누르면 LoginAlert가 open된다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("button", {
      name: /마이페이지/,
    })

    // when
    fireEvent.click(myPageButton)

    // then
    const loginAlert = screen.getByText("LoginAlert open")

    expect(loginAlert).toBeInTheDocument()
  })

  it("로그인 시 마이페이지 링크를 누르면 마이페이지로 이동한다.", async () => {
    // given, when
    login()

    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("link", {
      name: /마이페이지/,
    }) as HTMLAnchorElement

    // then
    expect(myPageButton.href).toContain(ROUTE.MY_PAGE)
  })

  it("미로그인 시 참여 중인 프로젝트 링크를 누르면 LoginAlert가 open된다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("button", {
      name: /참여 중인 프로젝트/,
    })

    // when
    fireEvent.click(myPageButton)

    // then
    const loginAlert = screen.getByText("LoginAlert open")

    expect(loginAlert).toBeInTheDocument()
  })

  it("로그인 시 참여 중인 프로젝트 링크를 누르면 참여 중인 프로젝트로 이동한다.", async () => {
    // given, when
    login()

    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("link", {
      name: /참여 중인 프로젝트/,
    }) as HTMLAnchorElement

    // then
    expect(myPageButton.href).toContain(ROUTE.MY_PROJECTS)
  })

  it("미로그인 시 내가 받은 롤링페이퍼 링크를 누르면 LoginAlert가 open된다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("button", {
      name: /내가 받은 롤링페이퍼/,
    })

    // when
    fireEvent.click(myPageButton)

    // then
    const loginAlert = screen.getByText("LoginAlert open")

    expect(loginAlert).toBeInTheDocument()
  })

  it("로그인 시 내가 받은 롤링페이퍼 링크를 누르면 내가 받은 롤링페이퍼로 이동한다.", async () => {
    // given, when
    login()

    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("link", {
      name: /내가 받은 롤링페이퍼/,
    }) as HTMLAnchorElement

    // then
    expect(myPageButton.href).toContain(ROUTE.MY_ROLLING_PAPERS)
  })

  it("미로그인 시 롤링페이퍼 만들기 링크를 누르면 LoginAlert가 open된다.", async () => {
    // given
    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("button", {
      name: /롤링페이퍼 만들기/,
    })

    // when
    fireEvent.click(myPageButton)

    // then
    const loginAlert = screen.getByText("LoginAlert open")

    expect(loginAlert).toBeInTheDocument()
  })

  it("로그인 시 롤링페이퍼 만들기 링크를 누르면 롤링페이퍼 만들기로 이동한다.", async () => {
    // given, when
    login()

    await waitFor(() => {
      render(<NavigationBar size={10} isControllingScroll />)
    })

    const myPageButton = screen.getByRole("link", {
      name: /롤링페이퍼 만들기/,
    }) as HTMLAnchorElement

    // then
    expect(myPageButton.href).toContain("#")
  })

  // it("FAQ 링크를 누르면 FAQ로 이동한다.", () => {

  // })

  // it("고객센터 문의 링크를 누르면 고객센터 문의로 이동한다.", () => {

  // })
})
