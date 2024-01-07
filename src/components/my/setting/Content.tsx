"use client"

import {useState, useEffect, useContext} from "react"
import dynamic from "next/dynamic"
import {useRouter} from "next/navigation"
import {Portal, Loading} from "@/components"
import {EmailStore, NicknameStore, ProfileStore, UserIdStore} from "./Context"
import {UserId, Password, Profile, Nickname, Email, SubmitButton} from "./"
import useRequest from "@/hooks/use-request"
import Storage from "@/store/local-storage"
import {AUTH} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"

const ErrorAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

const Content = () => {
  const [isAlerting, setIsAlerting] = useState(false)

  const {setUserId} = useContext(UserIdStore)
  const {setProfile} = useContext(ProfileStore)
  const {setNickname} = useContext(NicknameStore)
  const {setEmail} = useContext(EmailStore)

  const router = useRouter()

  const {request, isLoading} = useRequest()

  useEffect(() => {
    async function getUserData() {
      const {code, data} = await request({
        method: "get",
        path: "/users",
      })

      if (code !== AUTH.USER.GET_DATA_SUCCESS) {
        setIsAlerting(true)

        return
      }

      setUserId(data.id)
      setProfile({
        type: "uploadUrl",
        data: Storage.get("profile") ?? "",
      })
      setNickname(data.nickName)
      setEmail(data.email ?? "")
    }

    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function closeAlert() {
    setIsAlerting(false)
    router.push(ROUTE.MY_PAGE)
  }

  return (
    <>
      <div className="subtitle mb-2">로그인 정보</div>
      <UserId />
      <Password />

      <div className="subtitle mb-2">계정 정보</div>
      <Profile />
      <Nickname />
      <Email />

      <SubmitButton />

      <Portal
        render={() => (
          <>
            <Loading isLoading={isLoading} />
            <ErrorAlert
              isAlerting={isAlerting}
              onClose={closeAlert}
              content={
                <>
                  유저 정보를 가져오는 데에 실패했습니다.
                  <br />내 설정 페이지에 다시 접근해주시기 바랍니다.
                </>
              }
            />
          </>
        )}
      />
    </>
  )
}

export default Content
