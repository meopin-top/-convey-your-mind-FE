"use client"

import {useState, useEffect, type KeyboardEvent} from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import Pagination from "../Pagination"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import usePagination from "@/hooks/use-pagination"
import useRequest from "@/hooks/use-request"
import ROUTE from "@/constants/route"
import {OPEN, ALL_RECEIVED_ROLLING_PAPERS} from "@/constants/query-string"

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

const INITIAL_RECEIVED_ROLLING_PAPER_DATA: TResponse = {
  totalCount: 0,
  rollingPapers: [],
}

const AllReceivedRollingPapers = () => {
  const {getFirstPage, isValidPage} = usePagination() // useState 초깃값으로 사용하기 위함

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false) // TODO: handle 함수들이랑 함께 훅으로 뺄 수 있음
  const [receivedRollingPaperData, setReceivedRollingPapersData] =
    useState<TResponse>(INITIAL_RECEIVED_ROLLING_PAPER_DATA)
  const [page, setPage] = useState(getFirstPage())

  const router = useRouter()
  const searchParams = useSearchParams()

  const [inputPage, handleInputPage] = useInput(getFirstPage().toString())

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {request} = useRequest()

  const COUNT_PER_PAGE = 6
  const isOpenSearchParams =
    searchParams.get(OPEN) === ALL_RECEIVED_ROLLING_PAPERS

  useEffect(() => {
    if (isOpenSearchParams) {
      openBottomSheet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 히스토리 조작 시에 바텀 시트도 같이 움직이도록 만들기 위함
    setIsBottomSheetOpen(isOpenSearchParams)
    if (isOpenSearchParams) {
      fetchReceivedRollingPaperData()
    } else {
      setReceivedRollingPapersData(INITIAL_RECEIVED_ROLLING_PAPER_DATA)
    }
  }, [isOpenSearchParams])

  function openBottomSheet() {
    router.push(ROUTE.MY_ROLLING_PAPERS)
  }

  function closeBottomSheet() {
    router.push(ROUTE.MY_PAGE)
    setPage(getFirstPage())
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
        <Pagination
          page={page}
          inputPage={inputPage}
          totalCount={receivedRollingPaperData.totalCount}
          countPerPage={COUNT_PER_PAGE}
          handleInputPage={handleInputPage}
          clickPaginationArrow={clickPaginationArrow}
          searchPage={searchPage}
        />
      </BottomSheet>
    </>
  )
}

export default AllReceivedRollingPapers
