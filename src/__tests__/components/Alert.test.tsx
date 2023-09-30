import {render, screen, fireEvent} from "@testing-library/react"
import Alert from "@/components/Alert"

describe("Alert", () => {
  it("props로 blur가 true로 전달되면 wrapper의 부모는 blur 클래스를 가지게 된다.", () => {
    // given, when
    const text = "children"
    render(
      <Alert isAlerting={true} blur>
        {text}
      </Alert>
    )
    const wrapper = screen.getByText(text).parentElement

    // then
    expect(wrapper).toHaveClass("blur")
  })

  it("props로 blur가 전달되지 않으면 wrapper의 부모는 blur 클래스를 가지지 않는다.", () => {
    // given, when
    const text = "children"

    render(<Alert isAlerting={true}>{text}</Alert>)

    const wrapper = screen.getByText(text).parentElement

    // then
    expect(wrapper).not.toHaveClass("blur")
  })

  it("제목, 내용, 버튼이 렌더링되고 버튼을 클릭할 수 있다.", () => {
    // given
    const handleButtonClick = jest.fn()

    render(
      <Alert isAlerting={true}>
        <Alert.Title title="Test Title" />
        <Alert.Content>Test Content</Alert.Content>
        <Alert.ButtonWrapper>
          <Alert.Button onClick={handleButtonClick}>확인</Alert.Button>
        </Alert.ButtonWrapper>
      </Alert>
    )

    const titleElement = screen.getByText("Test Title")
    const contentElement = screen.getByText("Test Content")
    const buttonElement = screen.getByText("확인")

    // when
    fireEvent.click(buttonElement)

    // then
    expect(titleElement).toBeInTheDocument()
    expect(contentElement).toBeInTheDocument()
    expect(buttonElement).toBeInTheDocument()
    expect(handleButtonClick).toHaveBeenCalled()
  })

  it("제목, 내용, 버튼이 렌더링되지 않고 버튼을 클릭할 수 없다.", () => {
    // given, when
    render(<Alert isAlerting={true}>children</Alert>)

    const titleElement = screen.queryByText("Test Title")
    const contentElement = screen.queryByText("Test Content")
    const buttonElement = screen.queryByText("확인")

    // then
    expect(titleElement).toBeNull()
    expect(contentElement).toBeNull()
    expect(buttonElement).toBeNull()
  })
})
