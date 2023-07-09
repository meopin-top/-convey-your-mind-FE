"use client"

import {useEffect} from "react"
import Image from "next/image"
import {kakaoLogo, naverLogo} from "@/assets/images"
import ROUTE from "@/constants/route"

const WithOauth = () => {
  const LOGO_SIZE = 72

  // TODO: OAuth 토큰 관리 이야기 후 토큰 관리 추가하기
  // redirect 이후 생기는 해시 값 또는 쿼리 스트링 관리할 방법 구상하기(네이버의 경우 이 내용이 토큰임)

  useEffect(() => {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)

    new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: `${process.env.NEXT_PUBLIC_HOST}/${ROUTE.MY_PAGE}`,
      isPopup: false,
    }).init()
  }, [])

  function loginWithKakao() {
    if (window.Kakao.isInitialized()) {
      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_HOST}/${ROUTE.MY_PAGE}`,
      })
    }
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
        <button className="naver f-center">
          <Image
            className="mb-2"
            src={naverLogo}
            alt="네이버 로고"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
          />
          <section>네이버 로그인</section>
          <div id="naverIdLogin" />
        </button>
      </div>
    </>
  )
}

export default WithOauth
