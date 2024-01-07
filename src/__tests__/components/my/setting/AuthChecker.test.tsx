import {render, screen} from "@testing-library/react"
import {useRouter} from "next/navigation"
import Component from "@/components/my/setting/AuthChecker"
import Store from "@/store/setting-auth"
import {ROUTE} from "@/constants/service"

const AuthChecker = ({checked}: {checked: boolean}) => {
  return (
    <Store.Provider value={{checked, setChecked: jest.fn()}}>
      <Component />
    </Store.Provider>
  )
}

jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}))
jest.mock("../../../../components/Redirecting.tsx", () => ({
  __esModule: true,
  default: () => <div>리다이렉션 중...</div>
}))

describe("AuthChecker", () => {
  it("인증되지 않았다면 마이 페이지로 리다이렉트된다.", () => {
    // given, when
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock
    })

    render(<AuthChecker checked={false} />)

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_PAGE)
  })

  it("인증되었다면 컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    const routerPushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock
    })

    render(<AuthChecker checked={true} />)

    const component = screen.getByText("리다이렉션 중...")

    // then
    expect(routerPushMock).not.toHaveBeenCalled()
    expect(component).toBeInTheDocument()
  })
})