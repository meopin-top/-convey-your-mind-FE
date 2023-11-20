"use client"

import {useRouter} from "next/navigation"
import Image from "next/image"
import {kakaoLogo, naverLogo} from "@/assets/images"
import {ROUTE} from "@/constants/service"

const WithOauth = () => {
  const router = useRouter()

  const LOGO_SIZE = 72

  function loginWithKakao() {
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_HOST}${ROUTE.OAUTH_MIDDLEWARE}&response_type=code`
    )
  }

  function loginWithNaver() {
    router.push(
      `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&state=${process.env.NEXT_PUBLIC_NAVER_STATE}&redirect_uri=${process.env.NEXT_PUBLIC_HOST}${ROUTE.OAUTH_MIDDLEWARE}&response_type=code`
    )
  }

  return (
    <>
      <section className="oauth-guide mb-4">
        EASY하게 롤링페이퍼 관리하기
      </section>
      <div className="oauth-redirection">
        <button className="kakao f-center" onClick={loginWithKakao}>
          <a href="#">
            <Image
              className="mb-2"
              src={kakaoLogo}
              alt="카카오 로고"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
            />
            <section>카카오 로그인</section>
          </a>
        </button>
        <button className="naver f-center" onClick={loginWithNaver}>
          <a href="#">
            <Image
              className="mb-2"
              src={naverLogo}
              alt="네이버 로고"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
            />
            <section>네이버 로그인</section>
          </a>
        </button>
      </div>
    </>
  )
}

export default WithOauth
