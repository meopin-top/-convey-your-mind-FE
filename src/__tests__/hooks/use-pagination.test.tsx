import {render, screen} from "@testing-library/react"
import usePagination from "@/hooks/use-pagination"

const TestComponent = () => {
  const {getFirstPage, getLastPage, isValidPage} = usePagination()

  return (
    <>
      <div>첫 페이지: {getFirstPage()}</div>
      <div>마지막 페이지1: {getLastPage({totalCount: 5, countPerPage: 5})}</div>
      <div>마지막 페이지2: {getLastPage({totalCount: 6, countPerPage: 5})}</div>
      <div>
        유효한 페이지인지 확인1:{" "}
        {isValidPage({page: -1, totalCount: 5, countPerPage: 5}).toString()}
      </div>
      <div>
        유효한 페이지인지 확인2:{" "}
        {isValidPage({page: 100, totalCount: 5, countPerPage: 5}).toString()}
      </div>
      <div>
        유효한 페이지인지 확인3:{" "}
        {isValidPage({page: 1, totalCount: 5, countPerPage: 5}).toString()}
      </div>
    </>
  )
}

describe("usePagination", () => {
  it("첫 페이지는 1페이지이다.", () => {
    // given, when
    render(<TestComponent />)

    const firstPage = screen.getByText("첫 페이지: 1")

    // then
    expect(firstPage).toBeInTheDocument()
  })

  it("마지막 페이지는 Math.ceil(totalCount / countPerPage)이다.", () => {
    // given, when
    render(<TestComponent />)

    const lastPage1 = screen.getByText("마지막 페이지1: 1")
    const lastPage2 = screen.getByText("마지막 페이지2: 2")

    // then
    expect(lastPage1).toBeInTheDocument()
    expect(lastPage2).toBeInTheDocument()
  })

  it("페이지 유효성 검사 함수는 페이지가 첫 페이지와 마지막 페이지 사이의 숫자면 true를, 아니면 false를 반환한다.", () => {
    // given, when
    render(<TestComponent />)

    const isValid1 = screen.getByText("유효한 페이지인지 확인1: false")
    const isValid2 = screen.getByText("유효한 페이지인지 확인2: false")
    const isValid3 = screen.getByText("유효한 페이지인지 확인3: true")

    // then
    expect(isValid1).toBeInTheDocument()
    expect(isValid2).toBeInTheDocument()
    expect(isValid3).toBeInTheDocument()
  })
})
