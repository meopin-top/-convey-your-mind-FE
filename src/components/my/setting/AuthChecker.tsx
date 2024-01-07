"use client"

import {useState, useContext, useLayoutEffect} from "react"
import {useRouter} from "next/navigation"
import Store from "@/store/setting-auth"
import {Redirecting} from "@/components"
import {ROUTE} from "@/constants/service"

const AuthChecker = () => {
  const [isRedirecting, setIsRedirecting] = useState(true)

  const {checked} = useContext(Store)

  const router = useRouter()

  useLayoutEffect(() => {
    if (process.env.NODE_ENV !== "development" && !checked) {
      router.push(ROUTE.MY_PAGE)

      return
    }

    setIsRedirecting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Redirecting isRedirecting={isRedirecting} />
}

export default AuthChecker
