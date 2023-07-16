"use client"

import {useEffect} from "react"
import {useRouter} from "next/navigation"
import Image from "next/image"
import {kakaoLogo, naverLogo} from "@/assets/images"
import ROUTE from "@/constants/route"

const WithOauth = () => {
  const router = useRouter()

  const LOGO_SIZE = 72

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)
    }
  }, [])

  function loginWithKakao() {
    if (window.Kakao.isInitialized()) {
      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOST}/${ROUTE.OAUTH_MIDDLEWARE}`,
      })
    } else {
      alert("카카오 로그인이 준비되지 않았습니다. 조금 이따 다시 클릭해주세요.")
    }
  }

  function loginWithNaver() {
    router.push(
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&state=${process.env.NEXT_PUBLIC_NAVER_STATE}&redirect_uri=${process.env.NEXT_PUBLIC_HOST}/${ROUTE.OAUTH_MIDDLEWARE}`
    )
  }

  return (
    <>
      <section className="oauth-guide mb-4">
        EASY하게 롤링페이퍼 관리하기
      </section>
      <div className="oauth-redirection">
        <button className="kakao f-center" onClick={loginWithKakao}>
          <Image
            className="mb-2"
            src={kakaoLogo}
            alt="카카오톡 로고"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
          />
          <section>카카오 로그인</section>
        </button>
        <button className="naver f-center" onClick={loginWithNaver}>
          <Image
            className="mb-2"
            src={naverLogo}
            alt="네이버 로고"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
          />
          <section>네이버 로그인</section>
        </button>
      </div>
    </>
  )
}

export default WithOauth
