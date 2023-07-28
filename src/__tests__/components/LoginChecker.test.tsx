import {render, screen} from "@testing-library/react"
import {NeedLoggedIn, NeedNotLoggedIn} from "@/components/LoginChecker"

jest.mock("../../hooks/use-logged-in.ts", () => ({
  __esModule: true,
  useNeedLoggedIn: () => true,
  useNeedNotLoggedIn: () => false,
}))

jest.mock("../../components/Redirecting.tsx", () => ({
  __esModule: true,
  default: ({isRedirecting}: {isRedirecting: boolean}) => (
    <button disabled={isRedirecting} />
  ),
}))

describe("NeedLoggedIn", () => {
  it("useNeedLoggedIn 훅의 결과를 Redirecting 컴포넌트에게 전달한다.", () => {
    // given, when
    render(<NeedLoggedIn />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // then
    expect(button.disabled).toBeTruthy()
  })
})

describe("NeedNotLoggedIn", () => {
  it("useNeedNotLoggedIn 훅의 결과를 Redirecting 컴포넌트에게 전달한다.", () => {
    // given, when
    render(<NeedNotLoggedIn />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // then
    expect(button.disabled).toBeFalsy()
  })
})
