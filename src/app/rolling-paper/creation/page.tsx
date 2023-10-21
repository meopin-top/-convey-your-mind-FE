"use client"

import {NeedLoggedIn, Header} from "@/components"
import {Reducer} from "@/components"
import {
  QuitAlert,
  Progress,
  Whom,
  Personnel,
  Types,
  DueDate,
  SharingCode,
  SubmitButton
} from "@/components/rolling-paper/creation"
import {
  Provider,
  WhomProvider,
  PersonnelProvider,
  TypeProvider,
  DDayProvider,
  SharingCodeProvider
} from "@/components/rolling-paper/creation/Context"

const Creation = () => {
  const TOTAL_STEP = 5

  return (
    <>
      <NeedLoggedIn />
      <QuitAlert />

      <div className="creation root-wrapper">
        <Header />

        <Reducer components={[
          Provider,
          WhomProvider,
          PersonnelProvider,
          TypeProvider,
          DDayProvider,
          SharingCodeProvider,
        ]}>
          <main className="main">
            <h2 className="title">롤링페이퍼 시작하기</h2>
            <Progress totalCount={TOTAL_STEP} />
            <Whom />
            <Personnel />
            <Types />
            <DueDate />
            <SharingCode />
            <SubmitButton totalStep={TOTAL_STEP} />
          </main>
        </Reducer>
      </div>
    </>
  )
}

export default Creation
