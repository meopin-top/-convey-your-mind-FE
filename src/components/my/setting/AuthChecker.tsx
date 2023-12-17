"use client"

import {useState, useContext, useLayoutEffect} from "react"
import {useRouter} from "next/navigation"
import Store from "@/store/setting-auth"
import {Redirecting} from "@/components"
import useBackHandler from "@/hooks/use-back-handler"
import {ROUTE} from "@/constants/service"

const AuthChecker = () => {
  const [isRedirecting, setIsRedirecting] = useState(true)

  const {checked, setChecked} = useContext(Store)

  const router = useRouter()

  useBackHandler(handleBack)

  useLayoutEffect(() => {
    if (process.env.NODE_ENV !== "development" && !checked) {
      router.push(ROUTE.MY_PAGE)

      return
    }

    setIsRedirecting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleBack() {
    setChecked(false)
    router.push(ROUTE.MY_PAGE)
  }

  return (
    <>
      <Redirecting isRedirecting={isRedirecting} />
      <span className="back" onClick={handleBack}>
        《
      </span>
    </>
  )
}

export default AuthChecker
