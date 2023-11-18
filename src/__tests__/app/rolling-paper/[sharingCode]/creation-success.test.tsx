import {render, screen} from "@testing-library/react"
import CreationSuccess from "@/app/rolling-paper/creation/[sharingCode]/page"
import {redirect} from "next/navigation"
import {ROUTE} from "@/constants/service"
import {createFetchMock, deleteFetchMock} from "@/__mocks__/window"
import {ROLLING_PAPER} from "@/constants/response-code"

const NEED_LOGGED_IN = "NeedLoggedIn"
const HEADER = "Header"
const LINK = "Link"
const SHARING = "Sharing"

jest.mock("next/navigation", () => ({
  __esModule: true,
  redirect: jest.fn(),
}))
jest.mock("../../../../components/LoginChecker.tsx", () => ({
  __esModule: true,
  NeedLoggedIn: () => <>{NEED_LOGGED_IN}</>,
}))
jest.mock("../../../../components/Header.tsx", () => ({
  __esModule: true,
  default: () => <>{HEADER}</>,
}))
jest.mock(
  "../../../../components/rolling-paper/creation/[sharingCode]/Link.tsx",
  () => ({
    __esModule: true,
    default: () => <>{LINK}</>,
  })
)
jest.mock(
  "../../../../components/rolling-paper/creation/[sharingCode]/Sharing.tsx",
  () => ({
    __esModule: true,
    default: () => <>{SHARING}</>,
  })
)

describe("CreationSuccess", () => {
  afterEach(() => {
    deleteFetchMock()
    jest.clearAllMocks()
  })

  it("공유 코드가 존재하지 않으면 마이 페이지로 이동한다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValueOnce({
        json: () =>
          Promise.resolve({code: ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE}),
      })
    )

    render(await CreationSuccess({params: {sharingCode: "test"}}))

    // then
    expect(redirect).toBeCalledWith(ROUTE.MY_PAGE)
  })

  it("공유 코드가 존재하면 올바르게 렌더링한다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValueOnce({
        json: () =>
          Promise.resolve({code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS}),
      })
    )

    render(await CreationSuccess({params: {sharingCode: "test"}}))

    const header = screen.getByText(new RegExp(HEADER))
    const title = screen.getByText("롤링페이퍼 만들기")
    const link = screen.getByText(new RegExp(LINK))
    const sharing = screen.getByText(new RegExp(SHARING))
    const rollingPaperButton = screen.getByRole("button", {
      name: "롤링 페이퍼 쓰러 가기",
    })
    const myPageButton = screen.getByRole("button", {
      name: "마이 페이지",
    })

    // then
    expect(header).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(link).toBeInTheDocument()
    expect(sharing).toBeInTheDocument()
    expect(rollingPaperButton).toBeInTheDocument()
    expect(myPageButton).toBeInTheDocument()
  })

  it("'롤링 페이퍼 쓰러 가기' 버튼을 누르면 로그인 페이지로 이동한다.", async () => {
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValueOnce({
        json: () =>
          Promise.resolve({code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS}),
      })
    )

    render(await CreationSuccess({params: {sharingCode: "test"}}))

    const rollingPaperButtonAnchor = screen
      .getByRole("button", {
        name: "롤링 페이퍼 쓰러 가기",
      })
      .querySelector(":first-child")

    // then
    expect(rollingPaperButtonAnchor).toHaveAttribute("href", `#`)
  })

  it("'마이 페이지' 버튼을 누르면 로그인 페이지로 이동한다.", async () => {
    // given, when
    // given, when
    createFetchMock(
      jest.fn().mockResolvedValueOnce({
        json: () =>
          Promise.resolve({code: ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS}),
      })
    )

    render(await CreationSuccess({params: {sharingCode: "test"}}))

    const rollingPaperButtonAnchor = screen
      .getByRole("button", {
        name: "마이 페이지",
      })
      .querySelector(":first-child")

    // then
    expect(rollingPaperButtonAnchor).toHaveAttribute("href", `${ROUTE.MY_PAGE}`)
  })
})
