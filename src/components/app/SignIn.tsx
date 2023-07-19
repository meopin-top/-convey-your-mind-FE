"use client"

import type {KeyboardEvent, MutableRefObject} from "react"
import {redirect} from "next/navigation"
import Link from "next/link"
import {SecretInput} from "../"
import {post} from "@/api"
import Storage from "@/store/local-storage"
import {SIGN_IN} from "@/constants/response-code"
import useInput from "@/hooks/use-input"
import useFocus from "@/hooks/use-focus"
import ROUTE from "@/constants/route"

type TResponse = {
  message: string
  code: (typeof SIGN_IN)[keyof typeof SIGN_IN]
  data: {
    userId: string
    email: string
    nickName: string
    authMethod: string
    profile: string
  }
}

const SignIn = () => {
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
    const {message, code, data}: TResponse = await post("/users/sign-in", {
      userId,
      password,
    })

    if (code === SIGN_IN.SUCCESS) {
      new Storage().set("nickName", data.nickName)
      new Storage().set("profile", data.profile)
      redirect(ROUTE.MY_PAGE)
    }

    alert(message)
  }

  return (
    <>
      <input
        type="text"
        className="user-id radius-sm mb-2"
        placeholder="나의 ID 입력하기"
        minLength={6}
        maxLength={20}
        required
        value={userId}
        onKeyDown={handleUserIdInput}
        onChange={handleUserId}
      />
      <SecretInput
        className="password radius-sm mb-2"
        placeholder="나의 PW 입력하기"
        minLength={8}
        maxLength={20}
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
    </>
  )
}

export default SignIn
