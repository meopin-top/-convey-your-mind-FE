import {render, screen} from "@testing-library/react"
import MyPage from "@/app/my/page"
import {calculateRemainingDay} from "@/utils/formatter"
import {ROLLING_PAPER_STATUS} from "@/constants/request"
import {deleteFetchMock, createFetchMock} from "@/__mocks__/window"

const NEED_LOGGED_IN = "로그인 필요"
const HEADER = "헤더"
const USER_INFORMATION = "유저 정보"
const ROLLING_PAPER_PARTICIPATION = "롤링페이퍼 참여하기"
const ALL_PROJECTS = "참여 중인 프로젝트들"
const ALL_RECEIVED_ROLLING_PAPERS = "내가 받은 롤링페이퍼들"

jest.mock("../../components/LoginChecker.tsx", () => ({
  __esModule: true,
  NeedLoggedIn: () => <div>{NEED_LOGGED_IN}</div>,
}))
jest.mock("../../components/Header.tsx", () => ({
  __esModule: true,
  default: () => <div>{HEADER}</div>,
}))
jest.mock("../../components/my/UserInformation.tsx", () => ({
  __esModule: true,
  default: () => <div>{USER_INFORMATION}</div>,
}))
jest.mock("../../components/my/RollingPaperParticipation.tsx", () => ({
  __esModule: true,
  default: () => <div>{ROLLING_PAPER_PARTICIPATION}</div>,
}))
jest.mock("../../components/my/AllProjects.tsx", () => ({
  __esModule: true,
  default: () => <div>{ALL_PROJECTS}</div>,
}))
jest.mock("../../components/my/AllReceivedRollingPapers.tsx", () => ({
  __esModule: true,
  default: () => <div>{ALL_RECEIVED_ROLLING_PAPERS}</div>,
}))

describe("MyPage", () => {
  afterEach(() => {
    deleteFetchMock()
    jest.clearAllMocks()
  })

  it("컴포넌트를 올바르게 렌더링한다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValue({
        json: () => Promise.resolve({data: []}),
      })
    )

    render(await MyPage())

    const needLoggedIn = screen.getByText(NEED_LOGGED_IN)
    const header = screen.getByText(HEADER)
    const userInformation = screen.queryByText(USER_INFORMATION)
    const rollingPaperParticipation = screen.getByText(
      ROLLING_PAPER_PARTICIPATION
    )
    const allProjects = screen.getByText(ALL_PROJECTS)
    const allReceivedRollingPapers = screen.getByText(
      ALL_RECEIVED_ROLLING_PAPERS
    )

    // then
    expect(needLoggedIn).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(userInformation).toBeInTheDocument()
    expect(rollingPaperParticipation).toBeInTheDocument()
    expect(allProjects).toBeInTheDocument()
    expect(allReceivedRollingPapers).toBeInTheDocument()
  })

  it("참여 중인 프로젝트가 없다면 '참여 중인 프로젝트가 없습니다.' 문구가 렌더링된다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValue({
        json: () => Promise.resolve({data: []}),
      })
    )

    render(await MyPage())

    // then
    const noProject = screen.getByText("참여 중인 프로젝트가 없습니다.")

    expect(noProject).toBeInTheDocument()
  })

  it("참여 중인 프로젝트 내 정보는 받는 사람, D-day, 상태, 바로 가기 링크가 렌더링된다.", async () => {
    // given, when
    const DESTINATION = "someone"
    const EXPIRED_DATETIME = "2024-03-04T15:00:00"
    const STATUS = "R"
    const INVITE_CODE = "abcdefu"
    createFetchMock(
      jest.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            data: {
              pageResult: [
                {
                  id: 12,
                  title: null,
                  description: null,
                  inviteCode: INVITE_CODE,
                  maxInviteNum: 10,
                  destination: DESTINATION,
                  type: "D",
                  status: STATUS,
                  createdDatetime: "2023-11-26T05:54:56.602386",
                  updatedDatetime: "2023-11-26T05:54:56.602386",
                  expiredDatetime: EXPIRED_DATETIME,
                  owner: true,
                },
              ],
            },
          }),
      })
    )

    render(await MyPage())

    // then
    const destination = screen.getAllByText(DESTINATION)[0]
    const dDay = screen.getByText(
      `D-${Math.max(Math.min(calculateRemainingDay(EXPIRED_DATETIME), 999), 0)}`
    )
    const status = screen.getByText(ROLLING_PAPER_STATUS[STATUS])
    const link = screen.getByText(/바로 가기/) as HTMLAnchorElement

    expect(destination).toBeInTheDocument()
    expect(dDay).toBeInTheDocument()
    expect(status).toBeInTheDocument()
    expect(link).toBeInTheDocument()
    expect(link.href).toContain(`rolling-paper/edit/${INVITE_CODE}`)
  })

  it("받은 롤링 페이퍼가 없다면 '받은 롤링페이퍼가 없습니다.' 문구가 렌더링된다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValue({
        json: () => Promise.resolve({data: []}),
      })
    )

    render(await MyPage())

    // then
    const noRollingPaper = screen.getByText("받은 롤링페이퍼가 없습니다.")

    expect(noRollingPaper).toBeInTheDocument()
  })

  it("받은 롤링 페이퍼 내 정보는 받는 사람, 바로 가기 링크가 렌더링된다.", async () => {
    // given, when
    const DESTINATION = "someone"
    const INVITE_CODE = "abcdefu"
    createFetchMock(
      jest.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            data: {
              pageResult: [
                {
                  id: 12,
                  title: null,
                  description: null,
                  inviteCode: INVITE_CODE,
                  maxInviteNum: 10,
                  destination: DESTINATION,
                  type: "D",
                  status: "R",
                  createdDatetime: "2023-11-26T05:54:56.602386",
                  updatedDatetime: "2023-11-26T05:54:56.602386",
                  expiredDatetime: "2024-03-04T15:00:00",
                  owner: true,
                },
              ],
            },
          }),
      })
    )

    render(await MyPage())

    // then
    const destination = screen.getAllByText(DESTINATION)[1]
    const link = destination.closest("a") as HTMLAnchorElement

    expect(destination).toBeInTheDocument()
    expect(link).toBeInTheDocument()
    expect(link.href).toContain(`rolling-paper/view/${INVITE_CODE}`)
  })
})
