"use client"

import {useEffect} from "react"
import {useSearchParams, useRouter} from "next/navigation"
import {Redirecting} from "@/components"
import useRequest from "@/hooks/use-request"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"
import {SIGN_IN} from "@/constants/response-code"
import type {TSignInResponse} from "@/@types/auth"

const OauthMiddleware = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {request} = useRequest()

  const isKakaoSucceeded = Boolean(
    searchParams.get("code") && !searchParams.get("state")
  )
  const isNaverSucceeded = Boolean(
    searchParams.get("code") &&
      searchParams.get("state") === process.env.NEXT_PUBLIC_NAVER_STATE
  )
  const failureMessage = searchParams.get("error")
    ? searchParams.get("error_description")
    : "로그인에 실패했습니다."

  useEffect(() => {
    async function requestOauth(path: string) {
      const {message, code, data}: TSignInResponse = await request({
        path: `${path}?code=${searchParams.get("code")}`,
      })

      if (code === SIGN_IN.SUCCESS) {
        Storage.set("nickName", data.nickName)
        Storage.set("profile", data.profile)

        router.replace(ROUTE.MY_PAGE)
      }

      alert(message)
    }

    if (isKakaoSucceeded) {
      requestOauth("/oauth/kakao/callback")
    } else if (isNaverSucceeded) {
      requestOauth("/oauth/naver/callback")
    } else {
      alert(failureMessage)

      router.replace(ROUTE.MAIN)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return <Redirecting isRedirecting={true} blur />
}

export default OauthMiddleware
