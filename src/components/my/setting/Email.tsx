"use client"

import {useState, useContext, type ReactNode} from "react"
import dynamic from "next/dynamic"
import {EmailStore} from "./Context"
import useRequest from "@/hooks/use-request"
import {Spinner} from "@/assets/icons"
import {VALIDATOR} from "@/constants/input"
import {AUTH} from "@/constants/response-code"

const Portal = dynamic(() => import("../../Portal"), {loading: () => <></>})
const FlowAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

const Email = () => {
  const [alertMessage, setAlertMessage] = useState<ReactNode>(null)

  const {email, handleEmail} = useContext(EmailStore)

  const {request, isLoading} = useRequest()

  async function verify() {
    if (!VALIDATOR.EMAIL.test(email)) {
      setAlertMessage(<>올바른 이메일 형식이 아닙니다.</>)

      return
    }

    const {code} = await request({
      method: "post",
      path: "/users/email/verify",
      body: {
        email,
      },
    })

    if (code === AUTH.USER.SEND_EMAIL_SUCCESS) {
      setAlertMessage(
        <>
          입력하신 이메일 주소로
          <br />
          인증 메일이 전송되었습니다.
          <br />
          <br />
          <span className="highlight">
            <b>{"[저장하기]"}</b>
          </span>
          를 <b>반드시 클릭</b>해 주세요.
        </>
      )

      return
    }

    setAlertMessage(
      <>
        인증 메일 발송에는 실패했습니다.
        <br />
        설정 변경은 계속해서 진행할 수 있습니다.
      </>
    )
  }

  function closeAlert() {
    setAlertMessage(null)
  }

  return (
    <>
      <div className="input-wrapper f-center mb-2">
        <span className="input-name">예비 이메일</span>
        <input
          type="email"
          placeholder="이메일을 입력해주세요."
          className="input radius-sm mr-1"
          required
          value={email}
          onChange={handleEmail}
        />
        <button
          className="email-verification xxs radius-md"
          onClick={verify}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="sm" />
          ) : (
            <>
              인증 메일
              <br />
              보내기
            </>
          )}
        </button>
      </div>
      <section className="description">
        * 예비 이메일 등록 시, 추후 회원정보 찾기가 가능합니다.
      </section>

      <Portal
        render={() => (
          <FlowAlert
            isAlerting={!!alertMessage}
            onClose={closeAlert}
            content={alertMessage}
          />
        )}
      />
    </>
  )
}

export default Email
