"use client"

import type {KeyboardEvent, MutableRefObject} from "react"
import {useRouter} from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"
import {SecretInput} from "../"
import useRequest from "@/hooks/use-request"
import useInput from "@/hooks/use-input"
import useFocus from "@/hooks/use-focus"
import Storage from "@/store/local-storage"
import {SIGN_IN} from "@/constants/response-code"
import ROUTE from "@/constants/route"
import type {TSignInResponse} from "@/@types/auth"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})

const SignIn = () => {
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

    console.log(message, code, data)

    if (code === SIGN_IN.SUCCESS) {
      Storage.set("nickName", data.nickName)
      Storage.set("profile", data.profile)

      router.push(ROUTE.MY_PAGE)
    }

    alert(message)
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
      <button className="login md shadow-sm radius-md mb-4" onClick={signIn}>
        로그인
      </button>
      <Link className="my-account" href="#">
        내 계정 정보 찾기
      </Link>
      <Portal render={() => <Loading isLoading={isLoading} />} />
    </>
  )
}

export default SignIn
