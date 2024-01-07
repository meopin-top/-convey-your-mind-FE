import {render, screen, act, fireEvent} from "@testing-library/react"
import {useRouter} from "next/navigation"
import Component from "@/components/my/setting/QuitAlert"
import Store from "@/store/setting-auth"
import type {TProps as TPortalProps} from "@/components/Portal"
import {ROUTE} from "@/constants/service"

const setCheckedMock = jest.fn()

const QuitAlert = () => {
  return (
    <Store.Provider value={{checked: true, setChecked: setCheckedMock}}>
      <Component />
    </Store.Provider>
  )
}

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn()
}))
jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>
}))
jest.mock("../../../../components/FlowAlert.tsx", () => ({
  __esModule: true,
  default: ({
    isAlerting,
    onClick,
    additionalButton
  }: {isAlerting: boolean, onClick: () => void, additionalButton: string}) => (
    <>
      {isAlerting
      ?
        <>
          <div>FlowAlert open</div>
          <button onClick={onClick}>{additionalButton}</button>
        </>
      :
        <div>FlowAlert close</div>
      }
    </>
  )
}))

describe("QuitAlert", () => {
  it("뒤로 가기 이벤트가 발생할 경우 FlowAlert를 렌더링한다.", async () => {
    // given
    render(<QuitAlert />)

    // when
    act(() => {
      const popstateEvent = new Event("popstate")
      global.window.dispatchEvent(popstateEvent)
    })

    // then
    const content = await screen.findByText(/FlowAlert open/)
    const quitButton = await screen.findByRole("button", {name: "확인"})

    expect(content).toBeInTheDocument()
    expect(quitButton).toBeInTheDocument()
  })

  it("뒤로 가기 버튼을 누를 경우 FlowAlert를 렌더링한다.", async () => {
    // given
    render(<QuitAlert />)

    const backButton = screen.getByRole("button", {name: "《"})

    // when
    fireEvent.click(backButton)

    // then
    const content = await screen.findByText(/FlowAlert open/)
    const quitButton = await screen.findByRole("button", {name: "확인"})

    expect(content).toBeInTheDocument()
    expect(quitButton).toBeInTheDocument()
  })

  it("FlowAlert의 '확인' 버튼을 누를 경우 마이 페이지로 이동하고 인증 확인 여부를 false로 변경한다.", async () => {
    // given
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock
    })

    render(<QuitAlert />)

    const backButton = screen.getByRole("button", {name: "《"})

    fireEvent.click(backButton)

    const quitButton = await screen.findByRole("button", {name: "확인"})

    // when
    fireEvent.click(quitButton)

    // then
    expect(setCheckedMock).toBeCalledWith(false)
    expect(routerPushMock).toBeCalledWith(ROUTE.MY_PAGE)
  })
})
