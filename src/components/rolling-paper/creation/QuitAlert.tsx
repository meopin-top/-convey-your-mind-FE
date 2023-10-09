"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {Alert, Portal} from "@/components"
import useBackHandler from "@/hooks/use-back-handler"
import ROUTE from "@/constants/route"

const QuitAlert = () => {
  const [isAlerting, setIsAlerting] = useState(false)

  const router = useRouter()

  useBackHandler(openAlert)

  function openAlert() {
    setIsAlerting(true)
  }

  function quit() {
    router.push(ROUTE.MY_PAGE)
    setIsAlerting(false)
  }

  function cancel() {
    history.pushState(null, "", location.href)
    setIsAlerting(false)
  }

  return (
    <Portal
      render={() => (
        <Alert isAlerting={isAlerting} blur>
          <Alert.Content
            style={{
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            롤링페이퍼 생성을 그만두고
            <br />
            마이페이지로 돌아가시겠습니까?
            <br />* 작성 중인 내용은{" "}
            <span className="highlight">
              <b>저장되지 않습니다.</b>
            </span>
          </Alert.Content>
          <Alert.ButtonWrapper style={{columnGap: "4px"}}>
            <Alert.Button
              onClick={quit}
              type="dark-4"
              style={{flex: "1 0 120px", height: "32px"}}
            >
              그만두기
            </Alert.Button>
            <Alert.Button
              onClick={cancel}
              type="fill-dark-4"
              style={{flex: "1 0 120px", height: "32px"}}
            >
              취소
            </Alert.Button>
          </Alert.ButtonWrapper>
        </Alert>
      )}
    />
  )
}

export default QuitAlert
