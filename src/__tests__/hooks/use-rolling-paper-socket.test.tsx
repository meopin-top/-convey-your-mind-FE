import {render, fireEvent, screen} from "@testing-library/react"
import useRollingPaperSocket from "@/hooks/use-rolling-paper-socket"
import {senderTextContent} from "@/__mocks__/fixtures/rolling-paper"
import {createRandomUUID, removeRandomUUID} from "@/__mocks__/window"

type TDispatchEventMock = (event: string, option?: any) => void
type TWebSocketMock = Exclude<WebSocket, "dispatchEvent"> & {
  dispatchEvent: TDispatchEventMock
}

const WSS_HOST = "ws://localhost:8080"
const PROJECT_ID = "abc"

const Component = ({
  message,
  onReceiveTextMessage = jest.fn(),
  onReceiveImageMessage = jest.fn(),
}: {
  message?: string
  onReceiveTextMessage?: jest.Mock
  onReceiveImageMessage?: jest.Mock
}) => {
  const {socket, send, isContentSendingError} = useRollingPaperSocket(
    PROJECT_ID,
    onReceiveTextMessage,
    onReceiveImageMessage
  )

  function getMessage() {
    ;(socket as TWebSocketMock).dispatchEvent("message", {data: message})
  }

  function getError() {
    ;(socket as TWebSocketMock).dispatchEvent("error")
  }

  function getClose() {
    ;(socket as TWebSocketMock).dispatchEvent("close")
  }

  return (
    <>
      <div>error: {isContentSendingError ? "yes" : "no"}</div>
      <div>
        <button type="button" onClick={getMessage}>
          getMessage
        </button>
        <button type="button" onClick={getError}>
          getError
        </button>
        <button type="button" onClick={getClose}>
          getClose
        </button>
        <button type="button" onClick={() => send(senderTextContent)}>
          send
        </button>
      </div>
    </>
  )
}

describe("useRollingPaperSocket", () => {
  const removeEventListenerMock = jest.fn((event) => {
    delete websocketEventsMock[event]
  })
  const addEventListenerMock = jest.fn((event, callback) => {
    websocketEventsMock[event] = callback
  })
  let send: jest.Mock
  let websocketEventsMock: Record<string, Function>

  beforeAll(() => {
    process.env.NEXT_PUBLIC_WSS_HOST = WSS_HOST
    createRandomUUID()
  })

  beforeEach(() => {
    send = jest.fn()
    websocketEventsMock = {}
    ;(window as any).WebSocket = jest.fn(() => ({
      readyState: WebSocket.OPEN,
      close: jest.fn(),
      send,
      removeEventListener: removeEventListenerMock,
      addEventListener: addEventListenerMock,
      dispatchEvent: jest.fn((event, option) => {
        const callback = websocketEventsMock[event]
        callback(option)
      }),
    }))
  })

  afterEach(() => {
    delete (window as any).WebSocket
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_WSS_HOST = undefined
    removeRandomUUID()
  })

  it("컴포넌트 렌더링 시 웹 소켓을 생성해야 한다.", () => {
    // given, when
    render(<Component />)

    // then
    expect(window.WebSocket).toBeCalledWith(
      `${process.env.NEXT_PUBLIC_WSS_HOST}/${PROJECT_ID}`
    )
  })

  it("text 타입에 대한 message 이벤트를 받으면 'onReceiveTextMessage' 콜백을 실행한다.", () => {
    // given
    const onReceiveTextMessageMock = jest.fn()
    render(
      <Component
        onReceiveTextMessage={onReceiveTextMessageMock}
        message={JSON.stringify({
          user_id: "user_id",
          content_id: "content_id",
          content_type: "text",
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          text: {
            text: "text",
            sender: "sender",
          },
        })}
      />
    )

    const getMessageButton = screen.getByRole("button", {name: "getMessage"})

    // when
    fireEvent.click(getMessageButton)

    // then
    expect(onReceiveTextMessageMock).toHaveBeenCalled()
  })

  it("image 타입에 대한 message 이벤트를 받으면 'onReceiveImageMessage' 콜백을 실행한다.", () => {
    // given
    const onReceiveImageMessageMock = jest.fn()
    render(
      <Component
        onReceiveImageMessage={onReceiveImageMessageMock}
        message={JSON.stringify({
          user_id: "user_id",
          content_id: "content_id",
          content_type: "image",
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          image_url: "image_url",
        })}
      />
    )

    const getMessageButton = screen.getByRole("button", {name: "getMessage"})

    // when
    fireEvent.click(getMessageButton)

    // then
    expect(onReceiveImageMessageMock).toHaveBeenCalled()
  })

  it("error 이벤트를 받으면 isContentSendingError를 true로 만든다.", () => {
    // given, when
    render(<Component />)

    // then
    let error = screen.getByText(/error: no/)
    expect(error).toBeInTheDocument()

    const getErrorButton = screen.getByRole("button", {name: "getError"})

    // when
    fireEvent.click(getErrorButton)

    // then
    error = screen.getByText(/error: yes/)
    expect(error).toBeInTheDocument()
  })

  it("close 이벤트를 받으면 소켓을 새로 생성하고 이벤트 리스너를 다시 생성한다.", () => {
    // given, when
    render(<Component />)

    // then
    expect(removeEventListenerMock).toHaveBeenCalledTimes(3)
    expect(addEventListenerMock).toHaveBeenCalledTimes(3)

    const getCloseButton = screen.getByRole("button", {name: "getClose"})

    // when
    fireEvent.click(getCloseButton)

    // then
    expect(removeEventListenerMock).toHaveBeenCalledTimes(6)
    expect(addEventListenerMock).toHaveBeenCalledTimes(6)
  })

  it("send 함수를 실행하면 웹소켓 send 메서드를 실행한다.", () => {
    // given
    render(<Component />)

    const sendButton = screen.getByRole("button", {name: "send"})

    // when
    fireEvent.click(sendButton)

    // then
    expect(send).toHaveBeenCalledTimes(1)
  })
})
