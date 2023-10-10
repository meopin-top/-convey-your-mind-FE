import Link from "next/link"
import {NeedLoggedIn, Header} from "@/components"
import {
  UserInformation,
  RollingPaperParticipation,
  ProjectsInProgressing,
  ReceivedRollingPapers,
} from "@/components/my"

const MyPage = () => {
  return (
    <>
      <NeedLoggedIn />

      <div className="my-page root-wrapper">
        <Header />

        <main className="main f-center">
          <UserInformation
            right={
              <button className="profile-edit xxxs radius-sm mt-2">
                <Link href={"#"}>⚙️ 설정</Link>
              </button>
            }
          />
          <RollingPaperParticipation />
          <ProjectsInProgressing />
          <ReceivedRollingPapers />
        </main>
      </div>
    </>
  )
}

export default MyPage
