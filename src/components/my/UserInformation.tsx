"use client"

import {useState, useContext, type KeyboardEvent} from "react"
import dynamic from "next/dynamic"
import {useRouter} from "next/navigation"
import {User, Alert, SecretInput, Portal} from "@/components"
import Store from "@/store/setting-auth"
import useInput from "@/hooks/use-input"
import useRequest from "@/hooks/use-request"
import {ROUTE} from "@/constants/service"
import {AUTH} from "@/constants/response-code"

const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})
const ErrorAlert = dynamic(() => import("../FlowAlert"), {
  loading: () => <></>,
})

const UserInformation = () => {
  const [isAlerting, setIsAlerting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const {setChecked} = useContext(Store)

  const router = useRouter()

  const [password, handlePassword] = useInput()

  const {isLoading, request} = useRequest()

  function handleIsAlerting() {
    setIsAlerting(!isAlerting)
  }

  function handlePasswordInput(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      checkPassword()
    }
  }

  async function checkPassword() {
    const {code, message} = await request({
      path: "/users/password/verify",
      method: "post",
      body: {password},
    })

    if (code === AUTH.SIGN_UP.DIFFERENT_PASSWORDS) {
      setErrorMessage(message)

      return
    }

    setChecked(true)
    router.push(ROUTE.MY_SETTING)
  }

  function closeErrorAlert() {
    setErrorMessage("")
  }

  return (
    <>
      <User
        right={
          <button
            className="profile-edit xxxs radius-sm mt-2"
            onClick={handleIsAlerting}
          >
            ⚙️ 설정
          </button>
        }
      />

      <Portal
        render={() => (
          <>
            <Alert isAlerting={isAlerting} blur>
              <Alert.Title title="내 설정 접근" />
              <Alert.Content style={{textAlign: "center"}}>
                <div className="mt-1 mb-2">
                  보안을 위해 현재 비밀번호를 입력해 주세요.
                </div>
                <SecretInput
                  className="radius-sm mb-2"
                  placeholder="비밀번호를 입력해 주세요"
                  minLength={1}
                  maxLength={100}
                  required
                  value={password}
                  onKeyDown={handlePasswordInput}
                  onChange={handlePassword}
                />
              </Alert.Content>
              <Alert.ButtonWrapper style={{columnGap: "4px"}}>
                <Alert.Button
                  onClick={handleIsAlerting}
                  type="dark-4"
                  style={{flex: "1 0 120px", height: "32px"}}
                >
                  취소
                </Alert.Button>
                <Alert.Button
                  onClick={checkPassword}
                  type="fill-dark-4"
                  style={{flex: "1 0 120px", height: "32px"}}
                >
                  확인하기
                </Alert.Button>
              </Alert.ButtonWrapper>
            </Alert>
            <Loading isLoading={isLoading} />
            <ErrorAlert
              isAlerting={errorMessage.length !== 0}
              onClose={closeErrorAlert}
              content={errorMessage}
            />
          </>
        )}
      />
    </>
  )
}

export default UserInformation
