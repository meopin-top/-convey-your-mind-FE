"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import {kakaoLogoBlack, kakaoLogo} from "@/assets/images"
import {ClipboardCheck, Clipboard} from "@/assets/icons"
import {DOMAIN} from "@/constants/service"

type TProps = {
  sharingCode: string
}

const Sharing = ({sharingCode}: TProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const SHARING_URL = `${DOMAIN}/${sharingCode}`
  const TIME_OUT = 5000
  let timer: NodeJS.Timeout | null = null

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function copyToClipboard() {
    if (isCopied) {
      return
    }

    try {
      // navigator.permissions.query({name: "clipboard-write"})에서 "clipboard-write" 타입을 지원하는지 여부가 브라우저마다 다름
      // 지원 안 해도 clipboard 복사가 되기 때문에 따로 확인하지 않음
      await navigator.clipboard.writeText(SHARING_URL)

      // TODO: await이 물려있는 동안 다른 이벤트 리스너 동작하는지 확인하기

      setIsCopied(true)

      timer = setTimeout(() => {
        setIsCopied(false)
      }, TIME_OUT)
    } catch (_) {
      alert("클립보드에 복사하기를 실패했습니다.")
    }
  }

  return (
    <div className="sharing pl-4 pr-4">
      <button className="url-copy f-center" onClick={copyToClipboard}>
        {isCopied ? (
          <>
            <ClipboardCheck className="lg mb-1" />
            복사완료
          </>
        ) : (
          <>
            <Clipboard className="lg mb-1" />
            URL 복사
          </>
        )}
      </button>
      <button className="kakao-sharing f-center">
        <Image
          className="mb-1"
          src={kakaoLogoBlack}
          alt="카카오 공유하기"
          width={32}
          height={32}
        />
        카카오톡
        <br />
        공유하기
      </button>
      <Image
        src={kakaoLogo} // TODO: 이미지 교체
        alt="OS 공유하기"
        width={80}
        height={80}
      />
    </div>
  )
}

export default Sharing
