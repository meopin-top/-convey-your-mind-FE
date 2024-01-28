"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {Redirecting, Portal, FlowAlert} from "@/components"
import {ROUTE} from "@/constants/service"

type TProps = {
  sharingCode: string
}

const Redirection = ({sharingCode}: TProps) => {
  const [isAlerting, setIsAlerting] = useState(true)

  const router = useRouter()

  function closeAlert() {
    setIsAlerting(false)
    router.push(ROUTE.MY_PAGE)
  }

  return (
    <>
      <Redirecting isRedirecting />
      <Portal
        render={() => (
          <FlowAlert
            isAlerting={isAlerting}
            content={<>올바른 공유코드가 아닙니다: {sharingCode}</>}
            onClose={closeAlert}
          />
        )}
      />
    </>
  )
}

export default Redirection
