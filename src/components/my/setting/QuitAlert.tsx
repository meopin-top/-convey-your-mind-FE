"use client"

import {useState, useContext} from "react"
import dynamic from "next/dynamic"
import {useRouter} from "next/navigation"
import Store from "@/store/setting-auth"
import useBackHandler from "@/hooks/use-back-handler"
import {ROUTE} from "@/constants/service"

const Portal = dynamic(() => import("../../Portal"), {
  loading: () => <></>,
})
const FlowAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

const QuitAlert = () => {
  const [isAlerting, setIsAlerting] = useState(false)

  const {setChecked} = useContext(Store)

  const router = useRouter()

  useBackHandler(openIsAlerting)

  function openIsAlerting() {
    setIsAlerting(true)
  }

  function closeIsAlerting() {
    history.pushState(null, "", location.href)
    setIsAlerting(!isAlerting)
  }

  function quit() {
    setChecked(false)
    router.push(ROUTE.MY_PAGE)
  }

  return (
    <>
      <span className="back" onClick={openIsAlerting}>
        《
      </span>

      <Portal
        render={() => (
          <FlowAlert
            isAlerting={isAlerting}
            onClose={closeIsAlerting}
            content={
              <>
                변경을 취소할까요?
                <br />
                <span style={{fontSize: "10px"}}>
                  * 현재 창을 벗어날 경우{" "}
                  <b style={{textDecoration: "underline"}}>
                    변경사항이 저장되지 않습니다.
                  </b>
                </span>
              </>
            }
            defaultButton="취소"
            additionalButton="확인"
            onClick={quit}
          />
        )}
      />
    </>
  )
}

export default QuitAlert
