import {render, screen, fireEvent} from "@testing-library/react"
import type {TProps as TUserInformationProps} from "@/components/UserInformation"
import MyPage from "@/app/my/page"

const NEED_LOGGED_IN = "로그인 필요"
const HEADER = "헤더"
const ROLLING_PAPER_PARTICIPATION = "롤링페이퍼 참여하기"
const PROJECTS_IN_PROGRESSING = "참여 중인 프로젝트"
const RECEIVED_ROLLING_PAPERS = "내가 받은 롤링페이퍼"
const SETTING_CONFIRM_ALERT = "내 설정 접근"

jest.mock("../../components/LoginChecker.tsx", () => ({
  __esModule: true,
  NeedLoggedIn: () => <div>{NEED_LOGGED_IN}</div>,
}))
jest.mock("../../components/Header.tsx", () => ({
  __esModule: true,
  default: () => <div>{HEADER}</div>,
}))
jest.mock("../../components/UserInformation.tsx", () => ({
  __esModule: true,
  default: ({right}: TUserInformationProps) => <div>{right}</div>,
}))
jest.mock("../../components/my/RollingPaperParticipation.tsx", () => ({
  __esModule: true,
  default: () => <div>{ROLLING_PAPER_PARTICIPATION}</div>,
}))
jest.mock("../../components/my/ProjectsInProgressing.tsx", () => ({
  __esModule: true,
  default: () => <div>{PROJECTS_IN_PROGRESSING}</div>,
}))
jest.mock("../../components/my/ReceivedRollingPapers.tsx", () => ({
  __esModule: true,
  default: () => <div>{RECEIVED_ROLLING_PAPERS}</div>,
}))
jest.mock("../../components/my/SettingConfirmAlert.tsx", () => ({
  __esModule: true,
  default: ({isAlerting}: {isAlerting: boolean}) => (
    <>{isAlerting ? <div>{SETTING_CONFIRM_ALERT}</div> : <div />}</>
  ),
}))

describe("MyPage", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<MyPage />)

    const needLoggedIn = screen.getByText(NEED_LOGGED_IN)
    const header = screen.getByText(HEADER)
    const settingButton = screen.getByRole("button", {name: /설정/})
    const rollingPaperParticipation = screen.getByText(
      ROLLING_PAPER_PARTICIPATION
    )
    const projectsInProgressing = screen.getByText(PROJECTS_IN_PROGRESSING)
    const receivedRollingPapers = screen.getByText(RECEIVED_ROLLING_PAPERS)
    const settingConfirmAlert = screen.queryByText(SETTING_CONFIRM_ALERT)

    // then
    expect(needLoggedIn).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(settingButton).toBeInTheDocument()
    expect(rollingPaperParticipation).toBeInTheDocument()
    expect(projectsInProgressing).toBeInTheDocument()
    expect(receivedRollingPapers).toBeInTheDocument()
    expect(settingConfirmAlert).not.toBeInTheDocument()
  })

  it("설정 버튼을 클릭하면 SettingConfirmAlert을 렌더링한다.", async () => {
    // given
    render(<MyPage />)

    const settingButton = screen.getByRole("button", {name: /설정/})

    // when
    fireEvent.click(settingButton)

    // then
    const settingConfirmAlert = await screen.findByText(SETTING_CONFIRM_ALERT)

    expect(settingConfirmAlert).toBeInTheDocument()
  })
})
