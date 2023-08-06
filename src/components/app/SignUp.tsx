"use client"

import {useState, type KeyboardEvent, type MutableRefObject} from "react"
import {useRouter} from "next/navigation"
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
  const router = useRouter()

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
      alert("영문, 숫자, 특수문자만 사용 가능합니다.")

      return
    }

    if (!VALIDATOR.PASSWORD._.test(password)) {
      alert("안전을 위해 영문, 숫자, 특수문자를 혼합해서 설정해 주세요.")

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
      router.push(ROUTE.MY_PAGE)
    } else {
      alert(message)
    }
  }

  return (
    <>
      <section className="validity mb-1">
        <div className={`${userId.length >= 6 ? "valid" : "invalid"}-light`} />
        <span>6글자 이상</span>
      </section>
      <input
        type="text"
        className="user-id radius-sm mb-2"
        placeholder="나만의 ID로 시작하기"
        minLength={6}
        maxLength={20}
        required
        value={userId}
        onKeyDown={handleUserIdInput}
        onChange={handleUserId}
      />
      <section className="validity mb-1">
        <div
          className={`${
            VALIDATOR.PASSWORD.ENGLISH.test(password) ? "valid" : "invalid"
          }-light`}
        />
        <span>영문</span>
        <div
          className={`${
            VALIDATOR.PASSWORD.NUMBER.test(password) ? "valid" : "invalid"
          }-light`}
        />
        <span>숫자</span>
        <div
          className={`${
            VALIDATOR.PASSWORD.SPECIAL_CHARACTER.test(password)
              ? "valid"
              : "invalid"
          }-light`}
        />
        <span>특수 문자</span>
        <div
          className={`${password.length >= 8 ? "valid" : "invalid"}-light`}
        />
        <span>8글자 이상</span>
      </section>
      <SecretInput
        className="password radius-sm mb-2"
        placeholder="나만의 PW로 시작하기"
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
        가입하기
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
