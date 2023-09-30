"use client"

import {useState} from "react"
import {
  Progress,
  Whom,
  Personnel,
  Types,
  SharedCode,
  SubmitButton,
} from "@/components/rolling-paper/creation"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import type {TCreationInformation} from "@/@types/rolling-paper"

const RollingPaperCreation = () => {
  const [doneStep, setDoneStep] = useState<{
    [step in TCreationInformation]: boolean
  }>({
    WHOM: false,
    PERSONNEL: false,
    TYPE: true,
    SHARED_CODE: false,
  }) // TODO: 바꿔야 될 수 있음(공유 코드는 기본적으로 완성된거라고 생각한다면 SHARED_CODE: true가 맞음)
  const [toWhom, handleToWhom] = useInput("", (event: TInputChangeEvent) => {
    handleDoneStep(event.target.value.length !== 0, "WHOM")
  })
  const [personnel, handlePersonnel] = useInput(
    "",
    (event: TInputChangeEvent) => {
      handleDoneStep(event.target.value.length !== 0, "PERSONNEL")
    }
  )
  const [sharedCode, handleSharedCode] = useInput(
    "",
    (event: TInputChangeEvent) => {
      handleDoneStep(event.target.value.length !== 0, "SHARED_CODE")
    }
  )

  const TOTAL_STEP = 4
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

  // TODO: layout.tsx로 header 추가
  return (
    <main className="creation root-wrapper">
      <h2 className="title">롤링페이퍼 시작하기</h2>
      <Progress totalCount={TOTAL_STEP} doneCount={DONE_COUNT} />
      <Whom toWhom={toWhom} handleToWhom={handleToWhom} />
      <Personnel personnel={personnel} handlePersonnel={handlePersonnel} />
      <Types />
      <SharedCode sharedCode={sharedCode} handleSharedCode={handleSharedCode} />
      <SubmitButton
        disabled={TOTAL_STEP !== DONE_COUNT}
        toWhom={toWhom}
        personnel={personnel}
        sharedCode={sharedCode}
      />
    </main>
  )
}

export default RollingPaperCreation
