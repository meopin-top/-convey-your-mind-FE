"use client"

import {useState, type KeyboardEvent, useEffect} from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import Pagination from "../Pagination"
import useRequest from "@/hooks/use-request"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import usePagination from "@/hooks/use-pagination"
import {calculateRemainingDay} from "@/utils/formatter"
import {OPEN, ALL_PROJECTS, ROUTE} from "@/constants/service"
import {ROLLING_PAPER_STATUS, PROJECT_TYPE} from "@/constants/request"
import type {TRollingPaperInformation} from "@/@types/rolling-paper"

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

const INITIAL_PROJECT_DATA = {
  totalLength: 0,
  pageResult: [],
}

const AllProjects = () => {
  const {getFirstPage, getLastPage} = usePagination() // useState 초깃값으로 사용하기 위함

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [projectData, setProjectData] =
    useState<TResponse>(INITIAL_PROJECT_DATA)
  const [page, setPage] = useState(getFirstPage())

  const router = useRouter()
  const searchParams = useSearchParams()

  const [inputPage, handleInputPage, setInputPage] = useInput(
    getFirstPage().toString()
  )

  const {request, isLoading} = useRequest()

  const COUNT_PER_PAGE = 5
  const isOpenSearchParams = searchParams.get(OPEN) === ALL_PROJECTS

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
      fetchProjectData()
    } else {
      setPage(getFirstPage())
      setInputPage(getFirstPage().toString())
      setProjectData(INITIAL_PROJECT_DATA)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenSearchParams, page])

  async function fetchProjectData() {
    const {data} = await request({
      path: `/projects/page?pageSize=${COUNT_PER_PAGE}&pageNum=${page}&type=${PROJECT_TYPE.PARTICIPANT}`,
    })

    setProjectData(data)
  }

  function openBottomSheet() {
    router.push(ROUTE.MY_PROJECTS)
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
      totalCount: projectData.totalLength,
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
        <div className="all-projects f-center">
          <h5 className="title mb-2">참여 중인 프로젝트</h5>
          <span className="description mb-4">
            프로젝트 클릭 시, 해당 페이지로 이동합니다.
          </span>
          {projectData.pageResult.length > 0 ? (
            <ul>
              {projectData.pageResult.map((project) => (
                <li key={project.id} className="project mb-2">
                  <Link href={`rolling-paper/edit/${project.inviteCode}`}>
                    <span
                      className={`crown ${project.owner ? "shown" : "hidden"}`}
                    >
                      👑
                    </span>
                    <span className="name">{project.destination}</span>
                    {project.status !== "D" && (
                      <span className="until">
                        D-
                        {Math.max(
                          Math.min(
                            calculateRemainingDay(project.expiredDatetime),
                            999
                          ),
                          0
                        )}
                      </span>
                    )}
                    <span
                      className={`status ${project.status} f-center radius-xl mr-1 ml-1`}
                    >
                      {ROLLING_PAPER_STATUS[project.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-project mb-4">
              참여 중인 프로젝트가 없습니다.
            </div>
          )}
        </div>
        <Pagination
          page={page}
          inputPage={inputPage}
          totalCount={projectData.totalLength}
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

export default AllProjects
