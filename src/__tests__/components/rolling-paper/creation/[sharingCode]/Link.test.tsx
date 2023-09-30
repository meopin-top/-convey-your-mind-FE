import {render, screen} from "@testing-library/react"
import Link from "@/components/rolling-paper/creation/[sharingCode]/Link"
import {DOMAIN} from "@/constants/service"

describe("Link", () => {
  it("올바르게 렌더링한다.", () => {
    // given, when
    const sharingCode = "test"

    render(<Link sharingCode={sharingCode} />)

    const title = screen.getByText(
      "링크를 공유하여 롤링페이퍼를 함께 작성해 보세요!"
    )
    const anchor = screen.getByRole("link", {
      name: `${DOMAIN}/${sharingCode}`,
    })

    // then
    expect(title).toBeInTheDocument()
    expect(anchor).toBeInTheDocument()
  })
})
