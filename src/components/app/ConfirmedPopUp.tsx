"use client"

import {useState, type ChangeEvent, type KeyboardEvent} from "react"
import {Alert, SecretInput} from "../"
import useInput from "@/hooks/use-input"
import {VALIDATOR} from "@/constants/input"

export type TProps = {
  isAlerting: boolean
  isLoading: boolean
  userId: string
  password: string
  onClose: () => void
  onSubmit: (confirmedPassword: string) => void
}

const ConfirmedPopUp = ({
  isAlerting,
  isLoading,
  userId,
  password,
  onClose,
  onSubmit,
}: TProps) => {
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
    if (password !== confirmedPassword) {
      alert("PW가 일치하지 않습니다. 다시 한 번 입력해 주세요.")

      return
    }

    if (email.length !== 0 && !VALIDATOR.EMAIL.test(email)) {
      alert("유효하지 않은 이메일입니다. 다시 한 번 확인해 주세요.")

      return
    }

    onSubmit(confirmedPassword)
  }

  return (
    <Alert isAlerting={isAlerting} blur style={{width: "90%", padding: "24px"}}>
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
          <span>
            예비 이메일 등록하지 않을 경우, 추후 회원정보 찾기가{" "}
            <span className="highlight">불가</span>합니다.
          </span>
          <input
            className="radius-sm"
            style={{
              padding: "4px 8px",
              width: "100%",
              height: "38px",
              fontSize: "10px",
            }}
            placeholder="(선택) 이메일을 입력해주세요."
            value={email}
            maxLength={100}
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
          disabled={isLoading}
        >
          가입하기
        </Alert.Button>
      </Alert.ButtonWrapper>
    </Alert>
  )
}

export default ConfirmedPopUp
