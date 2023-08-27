"use client"

import {useState, type KeyboardEvent} from "react"
import dynamic from "next/dynamic"
import {calculateRemainingDay} from "@/utils/formatter"
import Link from "next/link"
import useRequest from "@/hooks/use-request"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import usePagination from "@/hooks/use-pagination"

const BottomSheet = dynamic(() => import("../BottomSheet"), {
  loading: () => <></>,
})

// ProjectsInProgressing.tsx랑 겹침
// TODO: API 명세 나오면 공통으로 선언
export type TStatus = "ready" | "created" | "finished"

type TProject = {
  id: number
  isCreator: boolean
  name: string
  until: string
  status: TStatus
  sharingCode: string
}

type TResponse = {
  totalCount: number
  projects: TProject[]
}

export const statusMapper = {
  ready: "참여 완료",
  created: "작성 전",
  finished: "전달 완료",
} as const

const data: TResponse = {
  totalCount: 47,
  projects: [
    {
      id: 1,
      isCreator: true,
      name: "프로젝트 이름 텍스트 노출 완전 길게 테스트해보기 완전 길겡ㅇㅇㅇㅇㅇㅇdddddddddddd",
      until: "Sat Aug 12 2023 21:30:16 GMT+0900",
      status: "ready",
      sharingCode: "123",
    },
    {
      id: 2,
      isCreator: false,
      name: "프로젝트 이름 텍스트 노출",
      until: "Sat Aug 12 2024 21:30:16 GMT+0900",
      status: "created",
      sharingCode: "456",
    },
    {
      id: 3,
      isCreator: false,
      name: "프로젝트 이름 텍스트 노출",
      until: "Sat Aug 12 2023 21:30:16 GMT+0900",
      status: "finished",
      sharingCode: "789",
    },
    {
      id: 4,
      isCreator: false,
      name: "프로젝트 이름 텍스트 노출",
      until: "Sat Aug 12 2023 21:30:16 GMT+0900",
      status: "finished",
      sharingCode: "789",
    },
    {
      id: 5,
      isCreator: false,
      name: "프로젝트 이름 텍스트 노출",
      until: "Sat Aug 12 2023 21:30:16 GMT+0900",
      status: "finished",
      sharingCode: "789",
    },
  ],
}

const COUNT_PER_PAGE = 5
const INITIAL_PROJECT_DATA: TResponse = {
  totalCount: 0,
  projects: [],
}

const AllProjects = () => {
  const {
    getFirstPage,
    getLastPage: calculateLastPage,
    isValidPage,
  } = usePagination() // useState 초깃값으로 사용하기 위함

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false) // TODO: handle 함수들이랑 함께 훅으로 뺄 수 있음
  const [projectData, setProjectData] =
    useState<TResponse>(INITIAL_PROJECT_DATA)
  const [page, setPage] = useState(getFirstPage())

  const [inputPage, handleInputPage] = useInput(getFirstPage().toString())

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {request} = useRequest()

  function openBottomSheet() {
    setIsBottomSheetOpen(true)
    window.history.pushState({bottomSheetOpen: true}, "")
    fetchProjectData()
  }

  function closeBottomSheet() {
    setIsBottomSheetOpen(false)
    setPage(getFirstPage())
    setProjectData(INITIAL_PROJECT_DATA)
  }

  function clickPaginationArrow(page: number) {
    setPage(page)
    handleInputPage({
      target: {value: page.toString()},
    } as TInputChangeEvent)
    fetchProjectData()
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
        totalCount: projectData.totalCount,
        countPerPage: COUNT_PER_PAGE,
      })
    ) {
      alert("유효한 페이지 범위가 아닙니다.")

      return
    }

    setPage(page)
    fetchProjectData()
  }

  function getLastPage() {
    return calculateLastPage({
      totalCount: projectData.totalCount,
      countPerPage: COUNT_PER_PAGE,
    })
  }

  async function fetchProjectData() {
    // TODO: API 연동

    setProjectData(data)
    alert("API 연동") // TODO: request로 변경하기
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
          {projectData && projectData.projects.length > 0 ? (
            <ul>
              {projectData.projects.map((project) => (
                <li key={project.id} className="project mb-2">
                  <Link href={project.sharingCode}>
                    <span
                      className={`crown ${
                        project.isCreator ? "shown" : "hidden"
                      }`}
                    >
                      👑
                    </span>
                    <span className="name">{project.name}</span>
                    {project.status !== "finished" && (
                      <span className="until">
                        D-{Math.max(calculateRemainingDay(project.until), 0)}
                      </span>
                    )}
                    <span
                      className={`status ${project.status} f-center radius-xl mr-1 ml-1`}
                    >
                      {statusMapper[project.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-project">참여 중인 프로젝트가 없습니다.</div>
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

export default AllProjects
