"use client"

import {useState, type ChangeEvent, type KeyboardEvent} from "react"
import {Alert, SecretInput} from "../"
import useInput from "@/hooks/use-input"
import {post} from "@/api"
import {SIGN_UP} from "@/constants/response-code"

export type TProps = {
  isAlerting: boolean
  userId: string
  password: string
  onClose: () => void
}

const ConfirmedPopUp = ({isAlerting, userId, password, onClose}: TProps) => {
  const [email, setEmail] = useState("")

  const [confirmedPassword, setConfirmedPassword] = useInput("")

  function handleConfirmedPassword(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      checkValidation()
    }
  }

  function handleEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  function checkValidation() {
    const emailValidation =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/

    if (password !== confirmedPassword) {
      alert("비밀번호가 일치하지 않습니다.")

      return
    }

    if (email.length !== 0 && !emailValidation.test(email)) {
      alert("이메일 형식을 확인해주세요.")

      return
    }

    signUp()
  }

  async function signUp() {
    // TODO: API 요청 보내면 loading 처리(button disabled), use-request 리팩토링
    const {message, code} = await post("/users/sign-up", {
      userId: userId.trim(),
      password: password.trim(),
      passwordCheck: confirmedPassword.trim(),
    })

    if (code === SIGN_UP.SUCCESS) {
      // TODO: 정책 결정 필요
    } else {
      alert(message)
    }
  }

  return (
    <Alert isAlerting={isAlerting} blur style={{width: "90%"}}>
      <Alert.Title title="정보를 확인해주세요" style={{marginBottom: "20px"}} />
      <Alert.Content>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "54px 1fr",
            gridTemplateRows: "repeat(2, 38px)",
            gap: "4px 8px",
            marginBottom: "40px",
            fontSize: "12px",
          }}
        >
          <span className="f-center" style={{fontWeight: "500"}}>
            ID
          </span>
          <input
            className="radius-sm"
            style={{padding: "4px 8px", color: "#1a237e"}}
            value={userId}
            disabled
          />
          <span className="f-center" style={{fontWeight: "500"}}>
            PW
          </span>
          <SecretInput
            className="radius-sm"
            style={{padding: "4px 8px", color: "#1a237e"}}
            placeholder="(2차 확인) PW를 한 번 더 입력해 주세요."
            minLength={8}
            maxLength={20}
            required
            value={confirmedPassword}
            onChange={setConfirmedPassword}
            onKeyDown={handleConfirmedPassword}
          />
        </div>
        <div className="f-center" style={{flexDirection: "column", gap: "4px"}}>
          <span>예비 이메일 등록 시, 추후 회원정보 찾기가 가능합니다.</span>
          <input
            className="radius-sm"
            style={{
              padding: "4px 8px",
              width: "90%",
              height: "38px",
              fontSize: "10px",
            }}
            placeholder="(선택) 이메일을 입력해주세요."
            value={email}
            onChange={handleEmail}
          />
        </div>
      </Alert.Content>
      <Alert.ButtonWrapper style={{height: "36px", marginTop: "20px"}}>
        <Alert.Button onClick={onClose} style={{width: "120px"}} type="dark-4">
          취소
        </Alert.Button>
        <Alert.Button
          onClick={checkValidation}
          style={{width: "120px"}}
          type="fill-dark-4"
        >
          가입하기
        </Alert.Button>
      </Alert.ButtonWrapper>
    </Alert>
  )
}

export default ConfirmedPopUp
