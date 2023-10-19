"use client"

import {useState, useContext} from "react"
import dynamic from "next/dynamic"
import {
  Store,
  DDayStore,
} from "@/components/rolling-paper/creation/Context"
import {calculateDateOffset, isBefore} from "@/utils/date"

const Portal = dynamic(() => import("../../Portal"), {
  loading: () => <></>
})
const ConfirmedPopUp = dynamic(() => import("./ConfirmedPopUp"), {
  loading: () => <></>
})
const ErrorAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>
})

type TProps = {
  totalStep: number
}

const SubmitButton = ({totalStep}: TProps) => {
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false)
  const [isConfirmAlertOpen, setIsConfirmAlertOpen] = useState(false)

  const {doneStep} = useContext(Store)
  const {dDay} = useContext(DDayStore)

  const expiredAt = calculateDateOffset(dDay)
  const DONE_COUNT = Object.values(doneStep).filter((done) => done).length

  function handleAlertOpen() {
    const now = new Date()
    const isInvalidExpiredAt = isBefore(expiredAt, now)
    if (isInvalidExpiredAt) {
      setIsErrorAlertOpen(true)

      return
    }

    setIsConfirmAlertOpen(true)
  }

  function closeConfirmAlert() {
    setIsConfirmAlertOpen(false)
  }

  function closeErrorAlert() {
    setIsErrorAlertOpen(false)
  }

  return (
    <>
      <button
        className={`submit-button mt-4 radius-lg shadow-md ${
          totalStep !== DONE_COUNT ? "disabled" : ""
        }`}
        disabled={totalStep !== DONE_COUNT}
        onClick={handleAlertOpen}
      >
        롤링 페이퍼 만들기
      </button>

      <Portal
        render={() => (
          <>
            <ConfirmedPopUp
              isAlerting={isConfirmAlertOpen}
              onClose={closeConfirmAlert}
            />
            <ErrorAlert
              isAlerting={isErrorAlertOpen}
              onClose={closeErrorAlert}
              content="마감일을 오늘보다 나중으로 선택해주세요."
            />
          </>
        )}
      />
    </>
  )
}

export default SubmitButton
