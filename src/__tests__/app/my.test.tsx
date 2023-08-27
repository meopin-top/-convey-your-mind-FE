import {render, screen} from "@testing-library/react"
import MyPage from "@/app/my/page"

const NEED_LOGGED_IN = "로그인 필요"
const HEADER = "헤더"
const USER_INFORMATION = "유저 정보"
const ROLLING_PAPER_PARTICIPATION = "롤링페이퍼 참여하기"
const PROJECTS_IN_PROGRESSING = "참여 중인 프로젝트"
const RECEIVED_ROLLING_PAPERS = "내가 받은 롤링페이퍼"

jest.mock("../../components/LoginChecker", () => ({
  __esModule: true,
  NeedLoggedIn: () => <div>{NEED_LOGGED_IN}</div>,
}))

jest.mock("../../components/Header", () => ({
  __esModule: true,
  default: () => <div>{HEADER}</div>,
}))

jest.mock("../../components/my/UserInformation", () => ({
  __esModule: true,
  default: () => <div>{USER_INFORMATION}</div>,
}))

jest.mock("../../components/my/RollingPaperParticipation", () => ({
  __esModule: true,
  default: () => <div>{ROLLING_PAPER_PARTICIPATION}</div>,
}))

jest.mock("../../components/my/ProjectsInProgressing", () => ({
  __esModule: true,
  default: () => <div>{PROJECTS_IN_PROGRESSING}</div>,
}))

jest.mock("../../components/my/ReceivedRollingPapers", () => ({
  __esModule: true,
  default: () => <div>{RECEIVED_ROLLING_PAPERS}</div>,
}))

describe("MyPage", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<MyPage />)

    const needLoggedIn = screen.getByText(NEED_LOGGED_IN)
    const header = screen.getByText(HEADER)
    const userInformation = screen.getByText(USER_INFORMATION)
    const rollingPaperParticipation = screen.getByText(
      ROLLING_PAPER_PARTICIPATION
    )
    const projectsInProgressing = screen.getByText(PROJECTS_IN_PROGRESSING)
    const receivedRollingPapers = screen.getByText(RECEIVED_ROLLING_PAPERS)

    // then
    expect(needLoggedIn).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(userInformation).toBeInTheDocument()
    expect(rollingPaperParticipation).toBeInTheDocument()
    expect(projectsInProgressing).toBeInTheDocument()
    expect(receivedRollingPapers).toBeInTheDocument()
  })
})
