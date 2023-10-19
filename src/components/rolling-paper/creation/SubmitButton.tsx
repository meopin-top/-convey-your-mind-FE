"use client"

import {useState} from "react"
import dynamic from "next/dynamic"
import {calculateDateOffset, isBefore} from "@/utils/date"
import type {TRollingPaperType} from "@/@types/rolling-paper"

const Portal = dynamic(() => import("../../Portal"), {
  loading: () => <></>,
})
const ConfirmedPopUp = dynamic(() => import("./ConfirmedPopUp"), {
  loading: () => <></>,
})
const ErrorAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

type TProps = {
  disabled: boolean
  toWhom: string
  personnel: string
  type: TRollingPaperType | null
  sharingCode: string
  dDay: number
}

const SubmitButton = ({
  disabled,
  toWhom,
  personnel,
  type,
  dDay,
  sharingCode,
}: TProps) => {
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false)
  const [isConfirmAlertOpen, setIsConfirmAlertOpen] = useState(false)

  const expiredAt = calculateDateOffset(dDay)

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
          disabled ? "disabled" : ""
        }`}
        disabled={disabled}
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
              toWhom={toWhom}
              personnel={personnel}
              type={type}
              dDay={dDay}
              sharingCode={sharingCode}
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
