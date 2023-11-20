import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import Component from "@/components/rolling-paper/creation/SharingCode"
import {SharingCodeProvider} from "@/components/rolling-paper/creation/Context"

const SharingCode = () => {
  return (
    <SharingCodeProvider>
      <Component />
    </SharingCodeProvider>
  )
}

const requestMock = jest.fn()
jest.mock("../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false,
  }),
}))

describe("SharingCode", () => {
  it("컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    requestMock.mockResolvedValueOnce({
      data: "",
    })

    render(<SharingCode />)

    const description = screen.getByText(/롤링페이퍼의 공유 코드는 무엇인가요/)
    const subDescription = screen.getByText(/기본 코드를 수정할 수 있습니다/)
    const input = screen.getByPlaceholderText(
      "공유 코드를 입력해주세요"
    ) as HTMLInputElement

    // then
    expect(description).toBeInTheDocument()
    expect(subDescription).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it("API 호출 성공 시 자동으로 공유 코드가 입력된다.", async () => {
    // given, when
    const sharingCode = "J1234"

    requestMock.mockResolvedValueOnce({
      data: sharingCode,
    })

    render(<SharingCode />)

    const inputElement = screen.getByPlaceholderText(
      "공유 코드를 입력해주세요"
    ) as HTMLInputElement

    // then
    await waitFor(() => {
      expect(inputElement.value).toEqual(sharingCode)
    })
  })

  it("API 호출 실패 시 기본 공유 코드는 빈값으로 노출된다.", async () => {
    // given, when
    requestMock.mockResolvedValueOnce({
      data: null,
    })

    render(<SharingCode />)

    const inputElement = screen.getByPlaceholderText(
      "공유 코드를 입력해주세요"
    ) as HTMLInputElement

    // then
    await waitFor(() => {
      expect(inputElement.value).toEqual("")
    })
  })

  it("특수기호는 공유코드에 포함될 수 없다.", async () => {
    // given
    const sharingCode = "J1234"

    requestMock.mockResolvedValueOnce({
      data: sharingCode,
    })

    render(<SharingCode />)

    const inputElement = screen.getByPlaceholderText(
      "공유 코드를 입력해주세요"
    ) as HTMLInputElement

    // when
    fireEvent.change(inputElement, {target: {value: "!@#"}})

    // then
    await waitFor(() => {
      expect(inputElement.value).toEqual(sharingCode)
    })
  })
})
