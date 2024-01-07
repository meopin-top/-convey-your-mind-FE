import {Suspense} from "react"
import Link from "next/link"
import {calculateRemainingDay} from "@/utils/formatter"
import {PROJECT_TYPE, ROLLING_PAPER_STATUS} from "@/constants/request"
import {NeedLoggedIn, Header, Loading} from "@/components"
import {
  UserInformation,
  RollingPaperParticipation,
  AllProjects,
  AllReceivedRollingPapers,
} from "@/components/my"
import type {TRollingPaperInformation} from "@/@types/rolling-paper"

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
  const jsonPromises: Promise<{
    data: {pageResult: TRollingPaperInformation[]}
  }>[] = await Promise.all(fetchPromises).then(
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
                    <span className="name txt-ellipsis">
                      {project.destination}
                    </span>
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
                      <div className="name">{rollingPaper.destination}</div>
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
