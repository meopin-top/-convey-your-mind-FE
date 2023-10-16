"use client"

import {useState} from "react"
import {NeedLoggedIn, Header} from "@/components"
import {
  QuitAlert,
  Progress,
  Whom,
  Personnel,
  Types,
  DueDate,
  SharingCode,
  SubmitButton,
} from "@/components/rolling-paper/creation"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import type {
  TCreationInformation,
  TRollingPaperType,
} from "@/@types/rolling-paper"

const Creation = () => {
  const [doneStep, setDoneStep] = useState<{
    [step in TCreationInformation]: boolean
  }>({
    WHOM: false,
    PERSONNEL: false,
    TYPE: false, // TODO: type 선택 시 증가하는 기능 추가 안 함
    DUE_DATE: true,
    SHARING_CODE: false,
  })
  const [type, setType] = useState<TRollingPaperType | null>(null)
  const [dDay, setDDay] = useState<number>(100)

  const [toWhom, handleToWhom] = useInput("", (event: TInputChangeEvent) => {
    handleDoneStep(event.target.value.length !== 0, "WHOM")
  })
  const [personnel, handlePersonnel, setPersonnel] = useInput(
    "",
    (event: TInputChangeEvent) => {
      handleDoneStep(event.target.value.length !== 0, "PERSONNEL")
    }
  )
  const [sharingCode, handleSharingCode] = useInput(
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

  function handleType(type: TRollingPaperType) {
    setType(type)
    handleDoneStep(true, "TYPE")
  }

  function handleDDay(dDay: number) {
    setDDay(dDay)
    handleDoneStep(dDay !== 0, "DUE_DATE")
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
          <Types type={type} handleType={handleType} />
          <DueDate dDay={dDay} handleDDay={handleDDay} />
          <SharingCode
            sharingCode={sharingCode}
            handleSharingCode={handleSharingCode}
          />
          <SubmitButton
            disabled={TOTAL_STEP !== DONE_COUNT}
            toWhom={toWhom}
            personnel={personnel}
            type={type}
            dDay={dDay}
            sharingCode={sharingCode}
          />
        </main>
      </div>
    </>
  )
}

export default Creation
