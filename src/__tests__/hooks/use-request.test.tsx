import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import {renderHook} from "@testing-library/react-hooks" // react 17 warning 발생
import useRequest from "@/hooks/use-request"
import {createFetchMock} from "@/__mocks__/window"

const testid = "error-box"

function TestComponent() {
  const {isLoading, error, request} = useRequest()

  async function getDataMock() {
    request({
      path: "/test",
    })
  }

  return (
    <>
      <button onClick={getDataMock} disabled={isLoading}>
        버튼
      </button>
      {error ? <div data-testid={testid}>에러 박스</div> : <></>}
    </>
  )
}

describe("useRequest", () => {
  it("처음에는 초깃값을 반환한다.", () => {
    // given, when
    createFetchMock(jest.fn().mockResolvedValueOnce(undefined))

    const {result} = renderHook(() => useRequest())

    // then
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it("request 호출 시 에러가 없다면 isLoading true를 반환한 뒤 request 끝난 이후 isLoading false를 반환한다.", async () => {
    // given, when
    createFetchMock(jest.fn().mockResolvedValueOnce(undefined))

    render(<TestComponent />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // then
    expect(button.disabled).toBeFalsy()

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => {
      expect(button.disabled).toBeTruthy()
    })

    await waitFor(() => {
      expect(button.disabled).toBeFalsy()
    })
  })

  it("request 호출 시 에러가 있다면 isLoading true를 반환한 뒤 error가 설정되고, 다시 isLoading false을 반환한다.", async () => {
    // given, when
    createFetchMock(jest.fn().mockResolvedValueOnce(new Error("test")))

    render(<TestComponent />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // then
    expect(button.disabled).toBeFalsy()

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => {
      expect(button.disabled).toBeTruthy()
    })

    // when
    const errorTestBox = screen.queryByTestId(testid)

    // then
    await waitFor(() => {
      expect(errorTestBox).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(button.disabled).toBeFalsy()
    })
  })
})
