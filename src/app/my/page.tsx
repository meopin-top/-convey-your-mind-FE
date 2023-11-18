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
          <UserInformation />
          <RollingPaperParticipation />
          <ProjectsInProgressing />
          <ReceivedRollingPapers />
        </main>
      </div>
    </>
  )
}

export default MyPage
