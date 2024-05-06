"use client"

import {useState, type ReactNode, type KeyboardEvent} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import useInput from "@/hooks/use-input"
import useRequest from "@/hooks/use-request"
import {ROLLING_PAPER} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})
const FlowAlert = dynamic(() => import("../FlowAlert"), {
  loading: () => <></>,
})

const RollingPaperParticipation = () => {
  const [alertMessage, setAlertMessage] = useState<ReactNode | null>(null)

  const router = useRouter()

  const [sharedText, handleSharedText] = useInput()

  const {isLoading, request} = useRequest()

  function handleSubmission(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      writeOrReceiveMine()
    }
  }

  async function writeOrReceiveMine() {
    const {code, message, data} = await request({
      path: "/projects/register",
      method: "post",
      body: {
        code: sharedText,
      },
    })

    if (
      code === ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE ||
      code === ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.INVALID_SHARING_CODE
    ) {
      setAlertMessage(message)
    } else if (
      code === ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.SUCCESS &&
      data?.status === ROLLING_PAPER.INVITATION_SUCCESS_STATUS
    ) {
      const sharingCode = sharedText.split("/")
      router.push(`${ROUTE.ROLLING_PAPER_EDIT}/${sharingCode}`)
    } else if (
      code === ROLLING_PAPER.INVITATION_OR_RECEIPT_CODE.SUCCESS &&
      data?.status === ROLLING_PAPER.RECEIPT_SUCCESS_STATUS
    ) {
      setAlertMessage(
        <>
          롤링페이퍼 등록 성공🥳
          <br />
          따뜻한 마음을 확인하러 갈까요?
        </>
      )
    } else {
      console.error("잘못된 API 처리")
    }
  }

  function closeAlert() {
    setAlertMessage(null)
  }

  function viewRollingPaper() {
    const sharingCode = sharedText.split("/")
    router.push(`${ROUTE.ROLLING_PAPER_VIEW}/${sharingCode}`)
  }

  return (
    <>
      <Link
        href={ROUTE.ROLLING_PAPER_CREATION}
        className="rolling-paper-creation f-center xxxl radius-sm shadow-md mb-4"
      >
        롤링페이퍼 새로 시작하기
      </Link>
      <span className="shared-code-description">
        롤링페이퍼의 공유코드를 알고 계신가요?
      </span>
      <div className="shared-code f-center">
        <input
          className="radius-sm"
          placeholder="공유코드 or URL을 입력해 주세요"
          value={sharedText}
          onChange={handleSharedText}
          onKeyDown={handleSubmission}
        />
        <button
          className="radius-sm"
          onClick={writeOrReceiveMine}
          disabled={sharedText.length === 0 || isLoading}
        >
          참여하기
        </button>
      </div>

      <Portal
        render={() => (
          <>
            <Loading isLoading={isLoading} />
            <FlowAlert
              isAlerting={!!alertMessage}
              onClose={closeAlert}
              content={alertMessage}
              defaultButton={typeof alertMessage === "string" ? "확인" : "취소"}
              additionalButton={
                typeof alertMessage === "string" ? undefined : "확인"
              }
              onClick={
                typeof alertMessage === "string" ? undefined : viewRollingPaper
              }
            />
          </>
        )}
      />
    </>
  )
}

export default RollingPaperParticipation
