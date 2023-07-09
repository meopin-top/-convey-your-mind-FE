"use client"

import {useState, type KeyboardEvent, type MutableRefObject} from "react"
import dynamic from "next/dynamic"
import {SecretInput} from "../"
import useInput from "@/hooks/use-input"
import useFocus from "@/hooks/use-focus"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const ConfirmedPopUp = dynamic(
  () => import("./").then((Components) => Components.ConfirmedPopUp),
  {
    loading: () => <></>,
  }
)

const SignUp = () => {
  const [isPopUpOpened, setIsPopUpOpened] = useState(false)

  const {ref: passwordInput, onKeyDown: handleUserIdInput} = useFocus(["Enter"])

  const [userId, handleUserId] = useInput()
  const [password, handlePassword] = useInput()

  function handlePasswordInput(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      checkValidation()
    }
  }

  function checkValidation() {
    const userIdValidation =
      /^[a-zA-Z0-9!@#$%^&*()-_=+{}\[\]|\\;:'",.<>/?]{6,20}$/
    const passWordValidation =
      /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*()-_=+{}\[\]|\\;:'",.<>/?])[a-zA-Z0-9!@#$%^&*()-_=+{}\[\]|\\;:'",.<>/?]{8,20}$/

    if (!userIdValidation.test(userId)) {
      alert("아이디 형식을 확인해주세요.")

      return
    }

    if (!passWordValidation.test(password)) {
      alert("비밀번호 형식을 확인해주세요.")

      return
    }

    handlePopUp()
  }

  function handlePopUp() {
    setIsPopUpOpened(!isPopUpOpened)
  }

  return (
    <>
      <input
        type="text"
        className="user-id radius-sm mb-2"
        placeholder="나만의 ID로 시작하기"
        // placeholder="영문, 숫자, 특수문자 사용 가능(6 ~ 20자)"
        minLength={6}
        maxLength={20}
        required
        value={userId}
        onKeyDown={handleUserIdInput}
        onChange={handleUserId}
      />
      <SecretInput
        className="password radius-sm mb-2"
        placeholder="나만의 PW로 시작하기"
        // placeholder="영문, 숫자, 특수문자중 두 가지 이상 혼합(8 ~ 20자)"
        minLength={8}
        maxLength={20}
        required
        inputRef={passwordInput as MutableRefObject<HTMLInputElement | null>}
        value={password}
        onKeyDown={handlePasswordInput}
        onChange={handlePassword}
      />
      <button
        className="login md shadow-sm radius-md"
        onClick={checkValidation}
      >
        로그인
      </button>
      <Portal
        render={() => (
          <ConfirmedPopUp
            isAlerting={isPopUpOpened}
            userId={userId}
            password={password}
            onClose={handlePopUp}
          />
        )}
      />
    </>
  )
}

export default SignUp
