"use client"

import {useState, type KeyboardEvent, type MutableRefObject} from "react"
import {redirect} from "next/navigation"
import dynamic from "next/dynamic"
import {SecretInput} from "../"
import useInput from "@/hooks/use-input"
import useFocus from "@/hooks/use-focus"
import useRequest from "@/hooks/use-request"
import {SIGN_UP} from "@/constants/response-code"
import {VALIDATOR} from "@/constants/input"
import ROUTE from "@/constants/route"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})
const ConfirmedPopUp = dynamic(() => import("./ConfirmedPopUp"), {
  loading: () => <></>,
})

const SignUp = () => {
  const [isPopUpOpened, setIsPopUpOpened] = useState(false)

  const {isLoading, request} = useRequest()

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
    if (userId.length === 0) {
      alert("ID가 입력되지 않았습니다. 다시 한 번 확인해 주세요.")

      return
    }

    if (password.length === 0) {
      alert("PW가 입력되지 않았습니다. 다시 한 번 확인해 주세요.")

      return
    }

    if (!VALIDATOR.USER_ID.test(userId)) {
      alert("영문, 숫자 특수문자만 사용 가능합니다.")

      return
    }

    if (!VALIDATOR.PASSWORD.test(password)) {
      alert(
        "안전을 위해 영문, 숫자, 특수문자 중 두 가지 이상 혼합해서 설정해 주세요."
      )

      return
    }

    handlePopUp()
  }

  function handlePopUp() {
    setIsPopUpOpened(!isPopUpOpened)
  }

  async function signUp(confirmedPassword: string) {
    const {message, code} = await request({
      path: "/users/sign-up",
      method: "post",
      body: {
        userId,
        password,
        passwordCheck: confirmedPassword,
      },
    })

    if (code === SIGN_UP.SUCCESS) {
      redirect(ROUTE.MY_PAGE)
    } else {
      alert(message)
    }
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
          <>
            <ConfirmedPopUp
              isAlerting={isPopUpOpened}
              userId={userId}
              password={password}
              onClose={handlePopUp}
              onSubmit={signUp}
            />
            <Loading isLoading={isLoading} />
          </>
        )}
      />
    </>
  )
}

export default SignUp
