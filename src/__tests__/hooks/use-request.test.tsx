import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import {renderHook} from "@testing-library/react-hooks" // react 17 warning 발생
import useRequest from "@/hooks/use-request"
import useLogOut from "@/hooks/use-log-out"
import {
  createFetchMock,
  createAlertMock,
  createDateMock,
  deleteFetchMock,
  deleteDateMock,
} from "@/__mocks__/window"
import {UNAUTHORIZED} from "@/constants/response-code"

const abortMock = jest.fn()

// @ts-ignore
global.AbortController = jest.fn(() => ({
  abort: abortMock,
  signal: null,
}))
jest.mock("../../hooks/use-log-out.ts")

const testid = "error-box"

function TestComponent() {
  const {isLoading, error, request} = useRequest()

  async function getDataMock() {
    await request({
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
  beforeAll(() => {
    createAlertMock()
  })

  afterEach(() => {
    deleteFetchMock()
    deleteDateMock()
    jest.clearAllMocks()
  })

  it("처음에는 초깃값을 반환한다.", () => {
    // given, when
    createDateMock({})
    createFetchMock(jest.fn().mockResolvedValueOnce(undefined))

    const {result} = renderHook(() => useRequest())

    // then
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it("request 호출 시 에러가 없다면 isLoading true를 반환한 뒤 request 끝난 이후 isLoading false를 반환한다.", async () => {
    // given, when
    createDateMock({})
    createFetchMock(
      jest.fn().mockResolvedValueOnce({ok: true, json: () => Promise.resolve()})
    )

    render(<TestComponent />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // then
    expect(button).not.toBeDisabled()

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => {
      expect(button).toBeDisabled()
    })

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it("request 호출 시 에러가 있다면 isLoading true를 반환한 뒤 error가 설정되고, 다시 isLoading false을 반환한다.", async () => {
    // given, when
    createDateMock({})
    createFetchMock(jest.fn().mockResolvedValueOnce(new Error("test")))

    render(<TestComponent />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // then
    expect(button).not.toBeDisabled()

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => {
      expect(button).toBeDisabled()
    })

    // when
    const errorTestBox = screen.queryByTestId(testid)

    // then
    await waitFor(() => {
      expect(errorTestBox).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })
  })

  it("request 호출 시 응답 코드가 UNAUTHORIZED라면 alert 호출 후 로그아웃 처리한다.", async () => {
    // given, when
    createDateMock({})
    const logOutMock = jest.fn()
    ;(useLogOut as jest.Mock).mockReturnValue(logOutMock)
    createFetchMock(
      jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            code: UNAUTHORIZED,
          }),
      })
    )

    render(<TestComponent />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => {
      expect(window.alert).toBeCalledWith(
        "인증이 만료되었습니다. 재로그인해주세요."
      )
      expect(logOutMock).toBeCalled()
    })
  })

  it("500ms 이내에 같은 API 경로로 요청이 발생하면 이전 API 호출을 중단한다.", async () => {
    // given
    createFetchMock(
      jest.fn().mockResolvedValue({ok: true, json: () => Promise.resolve()})
    )
    createDateMock({dateTime: 100, delta: 200})

    render(<TestComponent />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // when
    fireEvent.click(button)
    await waitFor(() => {
      expect(button).toBeDisabled()
    })
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
    fireEvent.click(button)

    // then
    expect(abortMock).toBeCalledTimes(1)
  })

  it("500ms를 넘은 간격으로 같은 API 경로로 요청이 발생하면 이전 API 호출을 중단하지 않는다.", async () => {
    // given
    createFetchMock(
      jest.fn().mockResolvedValue({ok: true, json: () => Promise.resolve()})
    )
    createDateMock({dateTime: 100, delta: 1000})

    render(<TestComponent />)

    const button = screen.getByRole("button") as HTMLButtonElement

    // when
    fireEvent.click(button)
    await waitFor(() => {
      expect(button).toBeDisabled()
    })
    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
    fireEvent.click(button)

    // then
    expect(abortMock).not.toBeCalled()
  })

  // it("500번대 에러가 반환되면 '서버 측 오류'가 콘솔에 출력된다.", () => {})

  // it("400번대 에러가 반환되면 '클라이언트 측 오류'가 콘솔에 출력된다.", () => {})

  // it("400번 미만의 에러가 반환되면 '데이터 fetch 에류'가 콘솔에 출력된다.", () => {})
})
