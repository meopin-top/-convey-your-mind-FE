import {render, screen, act} from "@testing-library/react"
import QuitAlert from "@/components/rolling-paper/creation/QuitAlert"
import type {TProps as TPortalProps} from "@/components/Portal"

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))
jest.mock("../../../../components/Portal.tsx", () => ({
  __esModule: true,
  default: ({render}: TPortalProps) => <>{render()}</>,
}))

describe("QuitAlert", () => {
  it("내용과 버튼을 올바르게 렌더링한다.", async () => {
    // given
    render(<QuitAlert />)

    // when
    act(() => {
      const popstateEvent = new Event("popstate")
      global.window.dispatchEvent(popstateEvent)
    })

    const content = await screen.findByText(/저장되지 않습니다/)
    const quitButton = await screen.findByRole("button", {name: "그만두기"})
    const cancelButton = await screen.findByRole("button", {name: "취소"})

    // then
    expect(content).toBeInTheDocument()
    expect(quitButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })
})
