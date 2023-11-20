"use client"

import {useState, useContext, type ReactNode, type KeyboardEvent} from "react"
import {useRouter} from "next/navigation"
import dynamic from "next/dynamic"
import useInput from "@/hooks/use-input"
import useRequest from "@/hooks/use-request"
import SignInStore from "@/store/sign-in"
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

const WithoutSignUp = () => {
  const [isInvalidAlert, setIsInvalidAlert] = useState(true) // flow상 롤링페이퍼 작성이 불가능해서 생기는 alert인지 여부
  const [alertMessage, setAlertMessage] = useState<ReactNode>(null)

  const {setTab, setRedirectTo} = useContext(SignInStore)

  const [sharedCode, handleSharedCode] = useInput()

  const {isLoading, request} = useRequest()

  const router = useRouter()

  async function writeRollingPaper() {
    if (sharedCode.length === 0) {
      setAlertMessage(<>공유코드나 URL을 입력해주세요.</>)

      return
    }

    const {code} = await request({
      path: `/projects/invite-code/${encodeURIComponent(sharedCode)}`,
    })

    if (code !== ROLLING_PAPER.INVITATION_CODE.QUERY_SUCCESS) {
      setAlertMessage(
        <>
          유효하지 않은 공유코드/URL입니다.
          <br />
          다시 한 번 확인해주세요.
        </>
      )

      return
    }

    setIsInvalidAlert(false)
    setAlertMessage(
      <>
        비회원으로 계속 하시겠습니까?
        <br />
        로그인 후 더욱 편리하게 사용할 수 있어요!
      </>
    )
  }

  function handleSharedCodeInput(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      writeRollingPaper()
    }
  }

  function closeAlert() {
    setAlertMessage(null)
  }

  function startWithSignIn() {
    setTab("signIn")
    setRedirectTo(ROUTE.ROLLING_PAPER_EDIT)

    closeAlert()
  }

  function startWithoutSignIn() {
    router.push(ROUTE.ROLLING_PAPER_EDIT)
    // router.push(sharedCode) // TODO: 롤링페이퍼 작성 화면 생성 후 수정
  }

  return (
    <>
      <section>가입없이</section>
      <div className="shared-code f-center">
        <input
          className="radius-sm"
          placeholder="공유코드로 바로 편지쓰기"
          value={sharedCode}
          onChange={handleSharedCode}
          onKeyDown={handleSharedCodeInput}
        />
        <button
          className="radius-sm"
          onClick={writeRollingPaper}
          disabled={isLoading}
        >
          입력
        </button>
      </div>
      <Portal
        render={() => (
          <>
            <Loading isLoading={isLoading} />
            {isInvalidAlert ? (
              <FlowAlert
                isAlerting={!!alertMessage}
                onClose={closeAlert}
                content={alertMessage}
              />
            ) : (
              <FlowAlert
                isAlerting={!!alertMessage}
                content={alertMessage}
                defaultButton="로그인"
                onClose={startWithSignIn}
                additionalButton="계속"
                onClick={startWithoutSignIn}
              />
            )}
          </>
        )}
      />
    </>
  )
}

export default WithoutSignUp
