import {render} from "@testing-library/react"
import {createPortal} from "react-dom"
import Portal from "@/components/Portal"
import usePortal from "@/hooks/use-portal"

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: jest.fn(),
}))
jest.mock("../../hooks/use-portal", () => jest.fn())

describe("Portal", () => {
  it("컴포넌트가 포탈로 렌더링된다.", () => {
    // given
    const MockComponent = () => <div>Mock Component</div>
    const mockRender = jest.fn().mockReturnValue(<MockComponent />)
    const mockPortal = document.createElement("div")

    ;(usePortal as jest.Mock).mockReturnValue(mockPortal)

    // when
    render(<Portal render={mockRender} />)

    // then
    expect(mockRender).toHaveBeenCalled()
    expect(createPortal).toHaveBeenCalledWith(<MockComponent />, mockPortal)
  })

  it("컴포넌트가 포탈로 렌더링되지 않는다.", () => {
    // given
    const mockRender = jest.fn()
    ;(usePortal as jest.Mock).mockReturnValue(null)

    // when
    const {container} = render(<Portal render={mockRender} />)

    // then
    expect(mockRender).not.toHaveBeenCalled()
    expect(container.firstChild).toBeNull()
  })
})
