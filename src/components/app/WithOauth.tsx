import Image from "next/image"
import {kakaoLogo, emailLogo} from "@/assets/images"

const WithOauth = () => {
  const LOGO_SIZE = 72

  // TODO: 로고 누르면 이동하기

  return (
    <>
      <section className="oauth-guide mb-4">
        EASY하게 롤링페이퍼 관리하기
      </section>
      <div className="oauth-redirection">
        <div className="kakao f-center">
          <Image
            className="mb-2"
            src={kakaoLogo}
            alt="카카오톡 로고"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
          />
          <section>카카오 로그인</section>
        </div>
        <div className="email f-center">
          <Image
            className="mb-2"
            src={emailLogo}
            alt="이메일 로고"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
          />
          <section>이메일 로그인</section>
        </div>
      </div>
    </>
  )
}

export default WithOauth
