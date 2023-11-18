"use client"

import {useState, type KeyboardEvent, type ReactNode} from "react"
import dynamic from "next/dynamic"
import {useRouter} from "next/navigation"
import useInput from "@/hooks/use-input"
import useRequest from "@/hooks/use-request"
import {VALIDATOR} from "@/constants/input"
import ROUTE from "@/constants/route"
import {ACCOUNT_INQUIRY} from "@/constants/response-code"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})
const FlowAlert = dynamic(() => import("../FlowAlert"), {
  loading: () => <></>,
})

type TAlert = {
  message: ReactNode | null
  type: "error" | "success" | ""
}

const EmailInput = () => {
  const [alert, setAlert] = useState<TAlert>({message: null, type: ""})

  const [email, handleEmail] = useInput("")

  const {isLoading, request} = useRequest()

  const router = useRouter()

  function handleSubmission(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      checkValidation()
    }
  }

  function checkValidation() {
    if (email.length === 0 || !VALIDATOR.EMAIL.test(email)) {
      setAlert({
        message: (
          <>
            유효하지 않은 이메일입니다.
            <br />
            다시 한 번 확인해 주세요.
          </>
        ),
        type: "error",
      })

      return
    }

    inquireAccount()
  }

  async function inquireAccount() {
    const {message, code} = await request({
      path: "/users/password",
      method: "post",
      body: {
        email,
      },
    })

    setAlert(
      code === ACCOUNT_INQUIRY.SUCCESS
        ? {message, type: "success"}
        : {message, type: "error"}
    )
  }

  function closeAlert() {
    if (alert.type === "success") {
      // sign-in store 변경할 필요는 없음
      router.push(ROUTE.MAIN)
    }

    setAlert({message: null, type: ""})
  }

  return (
    <>
      <h2 className="mb-4">내 계정 정보 찾기</h2>
      <p>ID, PW를 잊어버리셨나요?</p>
      <p>
        가입 시 or 사용 중 <span>예비 이메일</span>을 입력하셨다면,
      </p>
      <p className="mb-4">계정 정보를 찾을 수 있습니다.</p>
      <input
        className="radius-sm mb-2 email"
        placeholder="예비 이메일 입력하기"
        value={email}
        onChange={handleEmail}
        onKeyDown={handleSubmission}
        type="email"
        maxLength={100}
      />
      <button
        className="md shadow-sm radius-sm mb-4 inquiry-button"
        onClick={checkValidation}
      >
        내 정보 찾기
      </button>
      <p>입력하신 이메일과 일치하는 계정 정보가 존재할 경우,</p>
      <p>
        해당 이메일로 <span className="highlight">ID 정보와 매직링크</span>를
        보내드립니다.
      </p>
      <p>* 매직링크로 로그인 하신 후 비밀번호를 변경해 주세요!</p>

      <Portal
        render={() => (
          <>
            <FlowAlert
              isAlerting={!!alert.message}
              onClose={closeAlert}
              content={alert.message}
            />
            <Loading isLoading={isLoading} />
          </>
        )}
      />
    </>
  )
}

export default EmailInput
