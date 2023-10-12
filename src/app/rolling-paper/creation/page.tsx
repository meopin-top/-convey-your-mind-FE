"use client"

import {useState} from "react"
import {NeedLoggedIn, Header} from "@/components"
import {
  QuitAlert,
  Progress,
  Whom,
  Personnel,
  Types,
  SharingCode,
  SubmitButton,
} from "@/components/rolling-paper/creation"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import type {TCreationInformation} from "@/@types/rolling-paper"

const Creation = () => {
  const [doneStep, setDoneStep] = useState<{
    [step in TCreationInformation]: boolean
  }>({
    WHOM: false,
    PERSONNEL: false,
    TYPE: true,
    SHARING_CODE: false,
  }) // TODO: 바꿔야 될 수 있음(공유 코드는 기본적으로 완성된거라고 생각한다면 SHARING_CODE: true가 맞음)
  const [toWhom, handleToWhom] = useInput("", (event: TInputChangeEvent) => {
    handleDoneStep(event.target.value.length !== 0, "WHOM")
  })
  const [personnel, handlePersonnel, setPersonnel] = useInput(
    "",
    (event: TInputChangeEvent) => {
      handleDoneStep(event.target.value.length !== 0, "PERSONNEL")
    }
  )
  const [sharingCode, handleSharingCode, setSharingCode] = useInput(
    "",
    (event: TInputChangeEvent) => {
      handleDoneStep(event.target.value.length !== 0, "SHARING_CODE")
    }
  )

  const TOTAL_STEP = 5
  const DONE_COUNT = Object.values(doneStep).filter((done) => done).length

  function handleDoneStep(done: boolean, key: TCreationInformation) {
    const increase = done && !doneStep[key]
    const decrease = !done && doneStep[key]

    if (increase || decrease) {
      setDoneStep({
        ...doneStep,
        [key]: done,
      })
    }
  }

  return (
    <>
      <NeedLoggedIn />
      <QuitAlert />

      <div className="creation root-wrapper">
        <Header />

        <main className="main">
          <h2 className="title">롤링페이퍼 시작하기</h2>
          <Progress totalCount={TOTAL_STEP} doneCount={DONE_COUNT} />
          <Whom toWhom={toWhom} handleToWhom={handleToWhom} />
          <Personnel
            personnel={personnel}
            handlePersonnel={handlePersonnel}
            setPersonnel={setPersonnel}
          />
          <Types />
          <SharingCode
            sharingCode={sharingCode}
            handleSharingCode={handleSharingCode}
            setSharingCode={setSharingCode}
          />
          <SubmitButton
            disabled={TOTAL_STEP !== DONE_COUNT}
            toWhom={toWhom}
            personnel={personnel}
            sharingCode={sharingCode}
          />
        </main>
      </div>
    </>
  )
}

export default Creation
