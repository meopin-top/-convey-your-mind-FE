"use client"

import {useState, useContext, type ReactNode} from "react"
import dynamic from "next/dynamic"
import {useRouter} from "next/navigation"
import {PasswordStore, ProfileStore, NicknameStore, EmailStore} from "./Context"
import useRequest from "@/hooks/use-request"
import {VALIDATOR} from "@/constants/input"
import Storage from "@/store/local-storage"
import {AUTH} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"

const Portal = dynamic(() => import("../../Portal"), {loading: () => <></>})
const FlowAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

const SubmitButton = () => {
  const [errorMessage, setErrorMessage] = useState<ReactNode>(null)
  const [isAlerting, setIsAlerting] = useState(false)

  const router = useRouter()

  const {password, passwordConfirm} = useContext(PasswordStore)
  const {profile} = useContext(ProfileStore)
  const {nickname} = useContext(NicknameStore)
  const {email} = useContext(EmailStore)

  const {request, isLoading} = useRequest()

  async function submit() {
    if (!VALIDATOR.PASSWORD.test(password)) {
      setErrorMessage(
        <>
          비밀번호의 조건을 충족하지 않았습니다.
          <br />
          다시 한 번 확인해주세요.
        </>
      )

      return
    }

    if (password !== passwordConfirm) {
      setErrorMessage(
        <>
          비밀번호가 일치하지 않습니다.
          <br />
          다시 한 번 확인해주세요.
        </>
      )

      return
    }

    if (!nickname) {
      setErrorMessage(<>닉네임이 입력되지 않았습니다.</>)

      return
    }

    if (!!email && !VALIDATOR.EMAIL.test(email)) {
      setErrorMessage(<>이메일 형식이 올바르지 않습니다.</>)

      return
    }

    const {code, data} = await request({
      method: "put",
      path: "/users",
      body:
        profile.type === "dataUrl"
          ? {
              password,
              profile: profile.data,
              nickname,
              email,
            }
          : {
              password,
              profileUri: profile.data,
              nickname,
              email,
            },
    })

    if (code === AUTH.USER.DUPLICATED_EMAIL) {
      setErrorMessage(<>이미 존재하는 이메일입니다.</>)

      return
    }

    setIsAlerting(true)
    Storage.set("nickName", data.nickName)
    Storage.set("profile", data.profile)
  }

  function closeErrorAlert() {
    setErrorMessage(null)
  }

  function routeToMyPage() {
    router.push(ROUTE.MY_PAGE)
  }

  return (
    <>
      <button
        className="submit-button mt-4 radius-lg shadow-md"
        disabled={isLoading}
        onClick={submit}
      >
        저장하기
      </button>

      <Portal
        render={() => (
          <>
            <FlowAlert
              isAlerting={!!errorMessage}
              onClose={closeErrorAlert}
              content={errorMessage}
            />
            <FlowAlert
              isAlerting={isAlerting}
              onClose={routeToMyPage}
              content="변경 사항이 저장되었습니다."
            />
          </>
        )}
      />
    </>
  )
}

export default SubmitButton
