"use client"

import {useState} from "react"
import {NeedLoggedIn, Header} from "@/components"
import {
  UserInformation,
  RollingPaperParticipation,
  ProjectsInProgressing,
  ReceivedRollingPapers,
  SettingConfirmAlert,
} from "@/components/my"

const MyPage = () => {
  const [isAlerting, setIsAlerting] = useState(false)

  function handleIsAlerting() {
    setIsAlerting(!isAlerting)
  }

  return (
    <>
      <NeedLoggedIn />

      <div className="my-page root-wrapper">
        <Header />

        <main className="main f-center">
          <UserInformation
            right={
              <button
                className="profile-edit xxxs radius-sm mt-2"
                onClick={handleIsAlerting}
              >
                ⚙️ 설정
              </button>
            }
          />
          <RollingPaperParticipation />
          <ProjectsInProgressing />
          <ReceivedRollingPapers />
        </main>
      </div>
      <SettingConfirmAlert isAlerting={isAlerting} onClose={handleIsAlerting} />
    </>
  )
}

export default MyPage
