"use client"

import {useState, useEffect, type KeyboardEvent} from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import Pagination from "../Pagination"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import usePagination from "@/hooks/use-pagination"
import useRequest from "@/hooks/use-request"
import {OPEN, ALL_RECEIVED_ROLLING_PAPERS, ROUTE} from "@/constants/service"
import {PROJECT_TYPE} from "@/constants/request"
import {TRollingPaperInformation} from "@/@types/rolling-paper"

const BottomSheet = dynamic(() => import("../BottomSheet"), {
  loading: () => <></>,
})
const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})

type TResponse = {
  totalLength: number
  pageResult: TRollingPaperInformation[]
}

const INITIAL_ROLLING_PAPER_DATA = {
  totalLength: 0,
  pageResult: [],
}

const AllReceivedRollingPapers = () => {
  const {getFirstPage, getLastPage} = usePagination() // useState 초깃값으로 사용하기 위함

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [receivedRollingPaperData, setReceivedRollingPapersData] =
    useState<TResponse>(INITIAL_ROLLING_PAPER_DATA)
  const [page, setPage] = useState(getFirstPage())

  const router = useRouter()
  const searchParams = useSearchParams()

  const [inputPage, handleInputPage, setInputPage] = useInput(
    getFirstPage().toString()
  )

  const {request, isLoading} = useRequest()

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
      setPage(getFirstPage())
      setInputPage(getFirstPage().toString())
      setReceivedRollingPapersData(INITIAL_ROLLING_PAPER_DATA)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenSearchParams, page])

  async function fetchReceivedRollingPaperData() {
    const {data} = await request({
      path: `/projects/page?pageSize=${COUNT_PER_PAGE}&pageNum=${page}&type=${PROJECT_TYPE.RECEIVER}`,
    })

    setReceivedRollingPapersData(data)
  }

  function openBottomSheet() {
    router.push(ROUTE.MY_ROLLING_PAPERS)
  }

  function closeBottomSheet() {
    router.push(ROUTE.MY_PAGE)
  }

  function clickPaginationArrow(page: number) {
    setPage(page)
    handleInputPage({
      target: {value: page.toString()},
    } as TInputChangeEvent)
  }

  function searchPage(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (!isEnterKeyDowned) {
      return
    }

    const page = parseInt(inputPage)
    const firstPage = getFirstPage()
    const lastPage = getLastPage({
      totalCount: receivedRollingPaperData.totalLength,
      countPerPage: COUNT_PER_PAGE,
    })
    if (page < firstPage) {
      setInputPage(firstPage.toString())
      setPage(firstPage)
    } else if (page > lastPage) {
      setInputPage(lastPage.toString())
      setPage(lastPage)
    } else {
      setPage(page)
    }
  }

  return (
    <>
      <button className="view-all shadow-lg" onClick={openBottomSheet}>
        {`> 전체 보기`}
      </button>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
        <div className="all-rolling-papers f-center mb-2">
          <h5 className="title mb-2">참여 중인 프로젝트</h5>
          <span className="description mb-4">
            프로젝트 클릭 시, 해당 페이지로 이동합니다.
          </span>
          {receivedRollingPaperData.pageResult.length > 0 ? (
            <ul className="rolling-paper ml-2 mr-2">
              {receivedRollingPaperData.pageResult.map((rollingPaper) => (
                <li key={rollingPaper.id} className="shadow-sm">
                  <Link
                    href={`rolling-paper/view/${rollingPaper.inviteCode}`}
                    className="f-center pl-2 pr-2"
                  >
                    <div className="name">{rollingPaper.destination}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-rolling-paper mb-4">
              참여 중인 프로젝트가 없습니다.
            </div>
          )}
        </div>
        <Pagination
          page={page}
          inputPage={inputPage}
          totalCount={receivedRollingPaperData.totalLength}
          countPerPage={COUNT_PER_PAGE}
          handleInputPage={handleInputPage}
          clickPaginationArrow={clickPaginationArrow}
          searchPage={searchPage}
        />
      </BottomSheet>

      <Portal render={() => <Loading isLoading={isLoading} />} />
    </>
  )
}

export default AllReceivedRollingPapers
