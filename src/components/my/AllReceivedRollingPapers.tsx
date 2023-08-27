"use client"

import {useState, type KeyboardEvent} from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import usePagination from "@/hooks/use-pagination"
import useRequest from "@/hooks/use-request"

const BottomSheet = dynamic(() => import("../BottomSheet"), {
  loading: () => <></>,
})

type TRollingPaper = {
  id: number
  name: string
  link: string
}

type TResponse = {
  totalCount: number
  rollingPapers: TRollingPaper[]
}

const data: TResponse = {
  totalCount: 47,
  rollingPapers: [
    {
      id: 1,
      name: "프로젝트 이름 텍스트 노출 완전 길게 테스트해보기 완전 길겡ㅇㅇㅇㅇㅇㅇ",
      link: "https://www.naver.com",
    },
    {
      id: 2,
      name: "프로젝트 이름 텍스트 노출",
      link: "https://www.naver.com",
    },
    {
      id: 3,
      name: "프로젝트 이름 텍스트 노출",
      link: "https://www.naver.com",
    },
    {
      id: 4,
      name: "프로젝트 이름 텍스트 노출",
      link: "https://www.naver.com",
    },
    {
      id: 5,
      name: "프로젝트 이름 텍스트 노출",
      link: "https://www.naver.com",
    },
    {
      id: 6,
      name: "프로젝트 이름 텍스트 노출",
      link: "https://www.naver.com",
    },
  ],
}

const COUNT_PER_PAGE = 6
const INITIAL_RECEIVED_ROLLING_PAPER_DATA: TResponse = {
  totalCount: 0,
  rollingPapers: [],
}

const AllReceivedRollingPapers = () => {
  const {
    getFirstPage,
    getLastPage: calculateLastPage,
    isValidPage,
  } = usePagination() // useState 초깃값으로 사용하기 위함

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false) // TODO: handle 함수들이랑 함께 훅으로 뺄 수 있음
  const [receivedRollingPaperData, setReceivedRollingPapersData] =
    useState<TResponse>(INITIAL_RECEIVED_ROLLING_PAPER_DATA)
  const [page, setPage] = useState(getFirstPage())

  const [inputPage, handleInputPage] = useInput(getFirstPage().toString())

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {request} = useRequest()

  function openBottomSheet() {
    setIsBottomSheetOpen(true)
    window.history.pushState({bottomSheetOpen: true}, "")
    fetchReceivedRollingPaperData()
  }

  function closeBottomSheet() {
    setIsBottomSheetOpen(false)
    setPage(getFirstPage())
    setReceivedRollingPapersData(INITIAL_RECEIVED_ROLLING_PAPER_DATA)
  }

  function searchPage(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (!isEnterKeyDowned) {
      return
    }

    const page = parseInt(inputPage)
    if (
      !isValidPage({
        page,
        totalCount: receivedRollingPaperData.totalCount,
        countPerPage: COUNT_PER_PAGE,
      })
    ) {
      alert("유효한 페이지 범위가 아닙니다.")

      return
    }

    setPage(page)
    fetchReceivedRollingPaperData()
  }

  function clickPaginationArrow(page: number) {
    setPage(page)
    handleInputPage({
      target: {value: page.toString()},
    } as TInputChangeEvent)
    fetchReceivedRollingPaperData()
  }

  function getLastPage() {
    return calculateLastPage({
      totalCount: receivedRollingPaperData.totalCount,
      countPerPage: COUNT_PER_PAGE,
    })
  }

  async function fetchReceivedRollingPaperData() {
    // TODO: API 연동

    setReceivedRollingPapersData(data)
    alert("API 연동") // TODO: request로 변경하기
  }

  return (
    <>
      <button
        className="view-all shadow-lg"
        onClick={openBottomSheet}
      >{`> 전체 보기`}</button>
      <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
        <div className="all-rolling-papers f-center mb-2">
          <h5 className="title mb-2">참여 중인 프로젝트</h5>
          <span className="description mb-4">
            프로젝트 클릭 시, 해당 페이지로 이동합니다.
          </span>
          {receivedRollingPaperData &&
          receivedRollingPaperData.rollingPapers.length > 0 ? (
            <ul className="rolling-paper">
              {receivedRollingPaperData.rollingPapers.map((rollingPaper) => (
                <li key={rollingPaper.id} className="shadow-sm">
                  <Link href={rollingPaper.link} className="f-center pl-2 pr-2">
                    <div className="name">{rollingPaper.name}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-rolling-paper">
              참여 중인 프로젝트가 없습니다.
            </div>
          )}
        </div>
        <div className="pagination f-center">
          <button
            className="previous"
            disabled={page === getFirstPage()}
            onClick={() => clickPaginationArrow(page - 1)}
          >
            {"<"}
          </button>
          <input
            type="number"
            onKeyDown={searchPage}
            value={inputPage}
            onChange={handleInputPage}
          />{" "}
          / {getLastPage()}
          <button
            className="next"
            disabled={page === getLastPage()}
            onClick={() => clickPaginationArrow(page + 1)}
          >
            {">"}
          </button>
        </div>
      </BottomSheet>
    </>
  )
}

export default AllReceivedRollingPapers
