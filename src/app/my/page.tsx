import {Suspense} from "react"
import Link from "next/link"
import {calculateRemainingDay} from "@/utils/formatter"
import {PROJECT_TYPE} from "@/constants/request"
import {NeedLoggedIn, Header, Loading} from "@/components"
import {
  UserInformation,
  RollingPaperParticipation,
  AllProjects,
  AllReceivedRollingPapers,
} from "@/components/my"

// TODO: 왜 빌드할 때 서버 컴포넌트가 실행되고, start할 때는 실행이 안 되냐
// static? fetch? 뭐하고 관련된 걸까

// TODO: API 명세 작성되면 각각 알파벳 매핑 변경
// TODO: API 연동 어떻게 되는건지 DB 확인 필요
const statusMapper = {
  D: "참여 완료",
  E: "작성 전",
  F: "전달 완료",
} as const

type TResponse = {
  id: number
  title: string
  description: string
  inviteCode: string
  maxInviteNum: number
  destination: string
  type: (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE]
  status: keyof typeof statusMapper
  expiredDatetime: string
  owner: boolean
}

// const projectsMockData: TResponse[] = [
//   {
//     id: 1,
//     title: "관리자 프로젝트 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
//     description: "관리자 프로젝트 설명",
//     inviteCode: "관리자코드",
//     maxInviteNum: 10,
//     destination: "관리자",
//     type: "D",
//     status: "D",
//     expiredDatetime: "2023-09-30T04:55:55.272243",
//     owner: true,
//   },
//   {
//     id: 2,
//     title: "관리자 프로젝트",
//     description: "관리자 프로젝트 설명",
//     inviteCode: "관리자코드",
//     maxInviteNum: 10,
//     destination: "관리자",
//     type: "D",
//     status: "E",
//     expiredDatetime: "2023-09-30T04:55:55.272243",
//     owner: false,
//   },
//   {
//     id: 3,
//     title: "관리자 프로젝트",
//     description: "관리자 프로젝트 설명",
//     inviteCode: "관리자코드",
//     maxInviteNum: 10,
//     destination: "관리자",
//     type: "D",
//     status: "F",
//     expiredDatetime: "2023-09-30T04:55:55.272243",
//     owner: false,
//   },
// ]

async function getMyProjects() {
  const fetchPromises = [
    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/projects/page?pageSize=3&pageNum=1&type=${PROJECT_TYPE.PARTICIPANT}`,
      {
        next: {
          revalidate: 10,
        },
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/projects/page?pageSize=4&pageNum=1&type=${PROJECT_TYPE.RECEIVER}`,
      {
        next: {
          revalidate: 10,
        },
      }
    ),
  ]
  const jsonPromises: Promise<{data: {pageResult: TResponse[]}}>[] =
    await Promise.all(fetchPromises).then(
      ([fetchedProjects, fetchedRollingPapers]) => [
        fetchedProjects.json(),
        fetchedRollingPapers.json(),
      ]
    )

  const [
    {
      data: {pageResult: projects},
    },
    {
      data: {pageResult: rollingPapers},
    },
  ] = await Promise.all(jsonPromises)

  return {
    projects,
    rollingPapers,
  }
}

const MyPage = async () => {
  const {projects, rollingPapers} = await getMyProjects()

  console.log(projects, rollingPapers)

  return (
    <Suspense fallback={<Loading isLoading />}>
      <NeedLoggedIn />

      <div className="my-page root-wrapper">
        <Header />

        <main className="main f-center">
          <UserInformation />
          <RollingPaperParticipation />
          <div className="projects">
            <div className="header mb-2">
              <h5 className="title"># 참여 중인 프로젝트</h5>
              <AllProjects />
            </div>

            {projects?.length > 0 ? (
              <ul>
                {projects.map((project) => (
                  <li key={project.id} className="project mb-2">
                    {project.owner && <span className="crown">👑</span>}
                    <span className="name txt-ellipsis">{project.title}</span>
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
                      {statusMapper[project.status]}
                    </span>
                    <span className="to">
                      <Link
                        href={`rolling-paper/edit/${project.inviteCode}`}
                      >{`> 바로 가기`}</Link>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-project">참여 중인 프로젝트가 없습니다.</div>
            )}
          </div>
          <div className="rolling-papers">
            <div className="header mb-2">
              <h5 className="title"># 내가 받은 롤링페이퍼 💌</h5>
              <AllReceivedRollingPapers />
            </div>

            {rollingPapers?.length > 0 ? (
              <ul className="rolling-paper">
                {rollingPapers.map((rollingPaper) => (
                  <li key={rollingPaper.id} className="shadow-sm">
                    <Link
                      href={`rolling-paper/view/${rollingPaper.inviteCode}`}
                      className="f-center pl-2 pr-2"
                    >
                      <div className="name">{rollingPaper.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-rolling-paper">
                받은 롤링페이퍼가 없습니다.
              </div>
            )}
          </div>
        </main>
      </div>
    </Suspense>
  )
}

export default MyPage
