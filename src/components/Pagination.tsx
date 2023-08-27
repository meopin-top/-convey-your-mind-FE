import type {KeyboardEvent, ChangeEvent} from "react"
import usePagination from "@/hooks/use-pagination"

type TProps = {
  page: number
  inputPage?: string
  totalCount: number
  countPerPage: number
  clickPaginationArrow: (page: number) => void
  searchPage: (event: KeyboardEvent<HTMLInputElement>) => void
  handleInputPage?: (event: ChangeEvent<HTMLInputElement>) => void
}

const Pagination = ({
  page,
  inputPage,
  totalCount,
  countPerPage,
  clickPaginationArrow,
  searchPage,
  handleInputPage,
}: TProps) => {
  const {getFirstPage, getLastPage} = usePagination()

  return (
    <div className="pagination f-center">
      <button
        className="previous"
        disabled={page === getFirstPage()}
        onClick={() => clickPaginationArrow(page - 1)}
      >
        {"<"}
      </button>

      {handleInputPage && (
        <>
          <input
            type="number"
            onKeyDown={searchPage}
            value={inputPage}
            onChange={handleInputPage}
          />{" "}
          / {getLastPage({totalCount, countPerPage})}
        </>
      )}

      <button
        className="next"
        disabled={page === getLastPage({totalCount, countPerPage})}
        onClick={() => clickPaginationArrow(page + 1)}
      >
        {">"}
      </button>
    </div>
  )
}

export default Pagination
