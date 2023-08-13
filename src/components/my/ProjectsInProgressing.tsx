"use client"

import {useState, useEffect} from "react"
import AllProjects from "./AllProjects"
import Link from "next/link"
import {calculateRemainingDay} from "@/utils/formatter"

type TStatus = "ready" | "created" | "finished"

type TResponse = {
  id: number
  isCreator: boolean
  name: string
  until: string
  status: TStatus
  sharingCode: string
}

const statusMapper = {
  ready: "참여 완료",
  created: "작성 전",
  finished: "전달 완료",
} as const

const data: TResponse[] = [
  {
    id: 1,
    isCreator: true,
    name: "프로젝트 이름 텍스트 노출 완전 길게 테스트해보기 완전 길겡ㅇㅇㅇㅇㅇㅇ",
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
]

const ProjectsInProgressing = () => {
  // TODO: API 연동하면 RSC로 변경

  const [projects, setProjects] = useState<TResponse[]>([])

  useEffect(() => {
    setProjects(data)
  }, [])

  return (
    <div className="projects">
      <div className="header mb-2">
        <h5 className="title"># 참여 중인 프로젝트</h5>
        <AllProjects />
      </div>

      <ul>
        {projects.length > 0 ? (
          <>
            {projects.map((project) => (
              <li key={project.id} className="project mb-2">
                {project.isCreator && <span className="crown">👑</span>}
                <span className="name txt-ellipsis">{project.name}</span>
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
                <span className="to">
                  <Link href={project.sharingCode}>{`> 바로 가기`}</Link>
                </span>
              </li>
            ))}
          </>
        ) : (
          <li className="no-project">참여 중인 프로젝트가 없습니다.</li>
        )}
      </ul>
    </div>
  )
}

export default ProjectsInProgressing
