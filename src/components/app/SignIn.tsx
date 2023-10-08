"use client"

import {
  useState,
  useContext,
  type KeyboardEvent,
  type MutableRefObject,
} from "react"
import {useRouter} from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"
import {SecretInput} from "../"
import useRequest from "@/hooks/use-request"
import useInput from "@/hooks/use-input"
import useFocus from "@/hooks/use-focus"
import Storage from "@/store/local-storage"
import SignInStore from "@/store/sign-in"
import {SIGN_IN} from "@/constants/response-code"
import ROUTE from "@/constants/route"
import type {TSignInResponse} from "@/@types/auth"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})
const ErrorAlert = dynamic(() => import("../FlowAlert"), {
  loading: () => <></>,
})

const SignIn = () => {
  const [alertMessage, setAlertMessage] = useState("")

  const {redirectTo, setRedirectTo} = useContext(SignInStore)

  const router = useRouter()

  const {isLoading, request} = useRequest()

  const {ref: passwordInput, onKeyDown: handleUserIdInput} = useFocus(["Enter"])

  const [userId, handleUserId] = useInput()
  const [password, handlePassword] = useInput()

  function handlePasswordInput(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      signIn()
    }
  }

  async function signIn() {
    const {message, code, data}: TSignInResponse = await request({
      path: "/users/sign-in",
      method: "post",
      body: {
        userId,
        password,
      },
    })

    if (code === SIGN_IN.SUCCESS) {
      Storage.set("nickName", data.nickName)
      Storage.set("profile", data.profile)

      router.push(redirectTo)
      setRedirectTo(ROUTE.MY_PAGE)

      return
    }

    setAlertMessage(message)
  }

  function closeAlert() {
    setAlertMessage("")
  }

  return (
    <>
      <input
        type="text"
        className="user-id radius-sm mb-2"
        placeholder="나의 ID 입력하기"
        minLength={1}
        maxLength={100}
        required
        value={userId}
        onKeyDown={handleUserIdInput}
        onChange={handleUserId}
      />
      <SecretInput
        className="password radius-sm mb-2"
        placeholder="나의 PW 입력하기"
        minLength={1}
        maxLength={100}
        required
        inputRef={passwordInput as MutableRefObject<HTMLInputElement | null>}
        value={password}
        onKeyDown={handlePasswordInput}
        onChange={handlePassword}
      />
      <button
        className="login md shadow-sm radius-md mb-4"
        onClick={signIn}
        disabled={isLoading}
      >
        로그인하기
      </button>
      <Link className="my-account" href={ROUTE.ACCOUNT_INQUIRY}>
        내 계정 정보 찾기
      </Link>
      <Portal
        render={() => (
          <>
            <Loading isLoading={isLoading} />
            <ErrorAlert
              isAlerting={alertMessage.length !== 0}
              onClose={closeAlert}
              content={alertMessage}
            />
          </>
        )}
      />
    </>
  )
}

export default SignIn
