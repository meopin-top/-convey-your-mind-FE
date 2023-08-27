import {render, fireEvent, screen} from "@testing-library/react"
import Pagination from "@/components/Pagination"

describe("Pagination Component", () => {
  const mockClickPaginationArrow = jest.fn()
  const mockSearchPage = jest.fn()
  const mockHandleInputPage = jest.fn()

  const defaultProps = {
    page: 1,
    inputPage: "1",
    totalCount: 100,
    countPerPage: 10,
    clickPaginationArrow: mockClickPaginationArrow,
    searchPage: mockSearchPage,
    handleInputPage: mockHandleInputPage,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("previous / next 버튼이 렌더링된다.", () => {
    // given, when
    render(<Pagination {...defaultProps} />)

    const previousButton = screen.getByText("<")
    const nextButton = screen.getByText(">")

    // then
    expect(previousButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it("양 끝 페이지가 아닐 경우 previous, next 페이지네이션 이동 버튼이 disabled 상태가 아니다.", () => {
    // given, when
    render(<Pagination {...defaultProps} page={2} />)

    const previousButton = screen.getByText("<") as HTMLButtonElement
    const nextButton = screen.getByText(">") as HTMLButtonElement

    // then
    expect(previousButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
  })

  it("첫 페이지일 경우 previous 페이지네이션 이동 버튼이 disabled 상태이다.", () => {
    // given, when
    render(<Pagination {...defaultProps} />)

    const previousButton = screen.getByText("<")

    // then
    expect(previousButton).toBeDisabled()
  })

  it("마지막 페이지일 경우 next 페이지네이션 이동 버튼이 disabled 상태이다.", () => {
    // given, when
    render(
      <Pagination
        {...defaultProps}
        page={10}
        totalCount={100}
        countPerPage={10}
      />
    )

    const nextButton = screen.getByText(">")

    // then
    expect(nextButton).toBeDisabled()
  })

  it("previous 버튼이 클릭될 때 현재 페이지 - 1이 인자로 clickPaginationArrow props이 호출된다.", () => {
    // given
    const CURRENT_PAGE = 2

    render(<Pagination {...defaultProps} page={CURRENT_PAGE} />)

    const previousButton = screen.getByText("<")

    // when
    fireEvent.click(previousButton)

    // then
    expect(mockClickPaginationArrow).toHaveBeenCalledWith(CURRENT_PAGE - 1)
  })

  it("next 버튼이 클릭될 때 현재 페이지 + 1이 인자로 clickPaginationArrow props이 호출된다.", () => {
    // given
    const CURRENT_PAGE = 1

    render(<Pagination {...defaultProps} page={CURRENT_PAGE} />)

    const nextButton = screen.getByText(">")

    // when
    fireEvent.click(nextButton)

    // then
    expect(mockClickPaginationArrow).toHaveBeenCalledWith(CURRENT_PAGE + 1)
  })

  it("페이지네이션 input이 렌더링된다.", () => {
    // given, when
    render(<Pagination {...defaultProps} />)

    const paginationInput = screen.getByDisplayValue("1")

    // then
    expect(paginationInput).toBeInTheDocument()
  })

  it("handleInputPage props가 있을 때 페이지네이션 input와 마지막 페이지 번호가 렌더링된다.", () => {
    // given
    render(<Pagination {...defaultProps} handleInputPage={jest.fn()} />)

    // when
    const paginationInput = screen.getByDisplayValue("1")
    const lastPageNumber = screen.getByText("/ 10")

    expect(paginationInput).toBeInTheDocument()
    expect(lastPageNumber).toBeInTheDocument()
  })
})
