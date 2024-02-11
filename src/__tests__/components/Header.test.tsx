import {render, screen, waitFor} from "@testing-library/react"
import Header from "@/components/Header"

jest.mock("../../components/NavigationBar", () => ({
  __esModule: true,
  default: () => <div>네비게이션 바</div>,
}))

describe("Header", () => {
  it("로고를 렌더링한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<Header />)
    })

    const image = screen.getByAltText("logo")

    // then
    expect(image).toBeInTheDocument()
  })

  it("네이게이션 바를 렌더링한다.", async () => {
    // given, when
    await waitFor(() => {
      render(<Header />)
    })

    const navigationBar = screen.getByText("네비게이션 바")

    // then
    expect(navigationBar).toBeInTheDocument()
  })
})
