import {render, screen} from "@testing-library/react"
import Creation from "@/app/rolling-paper/creation/page"

const NEED_LOGGED_IN = "로그인 필요"
const HEADER = "헤더"
const QUIT_ALERT = "종료 얼럿"
const PROGRESS = "진행 상태"
const WHOM = "받는 사람"
const PERSONNEL = "참여 인원"
const TYPES = "롤링페이퍼 타입"
const SHARING_CODE = "공유코드"
const SUBMIT_BUTTON = "제출 버튼"

jest.mock("../../../components/LoginChecker.tsx", () => ({
  __esModule: true,
  NeedLoggedIn: () => <div>{NEED_LOGGED_IN}</div>,
}))
jest.mock("../../../components/Header.tsx", () => ({
  __esModule: true,
  default: () => <div>{HEADER}</div>,
}))
jest.mock("../../../components/rolling-paper/creation/QuitAlert.tsx", () => ({
  __esModule: true,
  default: () => <div>{QUIT_ALERT}</div>,
}))
jest.mock("../../../components/rolling-paper/creation/Progress", () => ({
  __esModule: true,
  default: () => <div>{PROGRESS}</div>,
}))
jest.mock("../../../components/rolling-paper/creation/Whom.tsx", () => ({
  __esModule: true,
  default: () => <div>{WHOM}</div>,
}))
jest.mock("../../../components/rolling-paper/creation/Personnel.tsx", () => ({
  __esModule: true,
  default: () => <div>{PERSONNEL}</div>,
}))
jest.mock("../../../components/rolling-paper/creation/Types.tsx", () => ({
  __esModule: true,
  default: () => <div>{TYPES}</div>,
}))
jest.mock("../../../components/rolling-paper/creation/SharingCode.tsx", () => ({
  __esModule: true,
  default: () => <div>{SHARING_CODE}</div>,
}))
jest.mock(
  "../../../components/rolling-paper/creation/SubmitButton.tsx",
  () => ({
    __esModule: true,
    default: () => <div>{SUBMIT_BUTTON}</div>,
  })
)

describe("Creation", () => {
  it("올바르게 렌더링한다.", () => {
    // given, when
    render(<Creation />)

    const title = screen.getByText("롤링페이퍼 시작하기")
    const quitAlert = screen.getByText(QUIT_ALERT)
    const progress = screen.getByText(PROGRESS)
    const whom = screen.getByText(WHOM)
    const personnel = screen.getByText(PERSONNEL)
    const types = screen.getByText(TYPES)
    const sharingCode = screen.getByText(SHARING_CODE)
    const submitButton = screen.getByText(SUBMIT_BUTTON)

    // then
    expect(title).toBeInTheDocument()
    expect(quitAlert).toBeInTheDocument()
    expect(progress).toBeInTheDocument()
    expect(whom).toBeInTheDocument()
    expect(personnel).toBeInTheDocument()
    expect(types).toBeInTheDocument()
    expect(sharingCode).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})
