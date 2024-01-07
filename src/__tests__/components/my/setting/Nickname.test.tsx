import {render, screen, fireEvent} from "@testing-library/react"
import {useState} from "react"
import Component from "@/components/my/setting/Nickname"
import {NicknameStore} from "@/components/my/setting/Context"
import {AUTH} from "@/constants/response-code"

const DEFAULT_NICKNAME = "default nickname"

const Nickname = () => {
  const [nickname, setNickname] = useState(DEFAULT_NICKNAME)

  return (
    <NicknameStore.Provider value={{nickname, setNickname, handleNickname: jest.fn()}}>
      <Component />
    </NicknameStore.Provider>
  )
}

const requestMock = jest.fn()
jest.mock("../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false
  })
}))
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn()
}))
jest.mock("../../../../assets/icons", () => ({
  __esModule: true,
  ArrowCycle: ({onClick}: {onClick: () => Promise<void>}) => <button onClick={onClick}>재생성</button>
}))

describe("Nickname", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    render(<Nickname />)

    const nicknameInput = screen.getByDisplayValue(DEFAULT_NICKNAME)
    const regeneratorButton = screen.getByRole("button", {name: /재생성/})

    // then
    expect(nicknameInput).toBeInTheDocument()
    expect(regeneratorButton).toBeInTheDocument()
  })

  it("'재생성' 버튼을 눌렀을 때 API가 올바르게 동작하면 API의 응답에 따라 닉네임 인풋값이 변경된다.", async () => {
    // given
    const NEW_NICKNAME = "new nickname"

    requestMock.mockResolvedValue({
      code: AUTH.USER.GET_RANDOM_NICKNAME_SUCCESS,
      data: NEW_NICKNAME,
    })

    render(<Nickname />)

    const regeneratorButton = screen.getByRole("button", {name: /재생성/})

    // when
    fireEvent.click(regeneratorButton)

    // then
    const nicknameInput = await screen.findByDisplayValue(DEFAULT_NICKNAME) as HTMLInputElement

    expect(nicknameInput.value).toEqual(NEW_NICKNAME)
  })

  it("'재생성' 버튼을 눌렀을 때 API가 올바르게 동작하지 않으면 닉네임 인풋은 변경되지 않는다.", async () => {
    // given
    const NEW_NICKNAME = "new nickname"

    requestMock.mockResolvedValue({
      code: -1,
      data: NEW_NICKNAME,
    })

    render(<Nickname />)

    const regeneratorButton = screen.getByRole("button", {name: /재생성/})

    // when
    fireEvent.click(regeneratorButton)

    // then
    const nicknameInput = await screen.findByDisplayValue(DEFAULT_NICKNAME) as HTMLInputElement

    expect(nicknameInput.value).toEqual(DEFAULT_NICKNAME)
  })
})
