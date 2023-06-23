"use client"

import {type KeyboardEvent} from "react"
import {post} from "@/api"
import Storage from "@/store/local-storage"
import {SIGN_IN} from "@/constants/response-code"
import {NICK_NAME_STORAGE_KEY} from "@/constants/authentication"
import useInput from "@/hooks/use-input"

const WithSignUp = () => {
  const [userId, handleUserId] = useInput()
  const [password, handlePassword] = useInput()

  function handleSignInUsingKeyboard(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      signIn()
    }
  }

  async function signIn() {
    // TODO: 유효성 검사 필요할 수도
    const {message, code, data} = await post("/users/sign-in", {
      userId,
      password,
    })

    if (code === SIGN_IN.SUCCESS) {
      new Storage().set(NICK_NAME_STORAGE_KEY, data.nickName) // TODO(remove): nickName이 있으면 로그인한 것
    }

    alert(message)
  }

  return (
    <>
      <section>or</section>
      <section className="tooltip mt-4 mb-4">
        <span className="description pt-2 pb-2">
          롤링페이퍼를 새로 만들고 싶다면?!
        </span>
      </section>
      <input
        type="text"
        className="user-id radius-sm mb-2"
        placeholder="나만의 ID로 시작하기"
        value={userId}
        onKeyDown={handleSignInUsingKeyboard}
        onChange={handleUserId}
      />
      <input
        type="password"
        className="password radius-sm mb-2"
        placeholder="나만의 PW로 시작하기"
        value={password}
        onKeyDown={handleSignInUsingKeyboard}
        onChange={handlePassword}
      />
      <button className="login md shadow-sm radius-md" onClick={signIn}>
        로그인
      </button>
    </>
  )
}

export default WithSignUp
