"use client"

import {useState, useEffect, type ReactNode} from "react"
import dynamic from "next/dynamic"
import Script from "next/script"
import Image from "next/image"
import {Loading, Toast} from "@/components"
import useCopy from "@/hooks/use-copy"
import {kakaoLogoBlackX, kakaoLogoBlack} from "@/assets/images"
import {ClipboardCheck, Clipboard, Share, Bell} from "@/assets/icons"
import {DOMAIN} from "@/constants/service"

const Portal = dynamic(() => import("../../../Portal"), {
  loading: () => <></>,
})
const ErrorAlert = dynamic(() => import("../../../FlowAlert"), {
  loading: () => <></>,
})

type TProps = {
  sharingCode: string
}

const Sharing = ({sharingCode}: TProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isKakaoSDKLoadFailed, setIsKakaoSDKLoadFailed] = useState(false)
  const [isOsShareLoading, setIsOsShareLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState<ReactNode>(null)

  const {copy} = useCopy()

  const SHARING_URL = `${DOMAIN}/${encodeURI(sharingCode)}`
  const TIME_OUT = 3_000
  let timer: NodeJS.Timeout | null = null

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function initializeKakao() {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)
  }

  function failToInitializeKakao() {
    setIsKakaoSDKLoadFailed(true)
  }

  async function copyToClipboard() {
    if (isCopied) {
      return
    }

    try {
      await copy(SHARING_URL)

      handleIsCopied()
    } catch (_) {
      setAlertMessage("클립보드에 복사하기를 실패했습니다.")
    }
  }

  function handleIsCopied() {
    setIsCopied(true)

    timer = setTimeout(() => {
      setIsCopied(false)
    }, TIME_OUT)
  }

  function shareOverKakao() {
    // 개발자 도구에서 모바일 모드로 전환한 상태에서는 동작 안 함: https://devtalk.kakao.com/t/scheme-does-not-have-a-registered-handler/112757

    const isKakaoInitialized = window.Kakao.isInitialized()
    if (!isKakaoInitialized) {
      setAlertMessage(
        <>
          현재 카카오톡 공유하기가 정상적으로 동작하지 않습니다.
          <br />
          재시도 또는 다른 방법을 이용해주세요.
        </>
      )
      failToInitializeKakao()

      return
    }

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "[Letterszip] 온라인에서 만나는 롤링페이퍼",
        description:
          "종이 편지에 담았던 진심과 정성을 그대로, 온라인에서 만나보세요!",
        imageUrl:
          "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg", // TODO: 이미지 나오면 변경
        link: {
          mobileWebUrl: SHARING_URL,
          webUrl: SHARING_URL,
        },
      },
      buttonTitle: "편지 쓰러 가기",
    })
  }

  async function shareOverOs() {
    const isShareSupported = !!navigator?.share

    setIsOsShareLoading(true)

    try {
      if (isShareSupported) {
        await navigator.share({
          title: "마음을 전해요",
          text: "롤링페이퍼에 참여하세요",
          url: SHARING_URL,
        })
      } else {
        throw new Error("공유하기 기능을 호출하는 데 실패했습니다.")
      }
    } catch (error: unknown) {
      setAlertMessage((error as Error).message)
    } finally {
      setIsOsShareLoading(false)
    }
  }

  function closeAlert() {
    setAlertMessage(null)
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
        onLoad={initializeKakao}
        onError={failToInitializeKakao}
      />

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
        <button
          className="kakao-sharing f-center"
          onClick={shareOverKakao}
          disabled={isKakaoSDKLoadFailed}
        >
          <Image
            className="mb-2"
            src={isKakaoSDKLoadFailed ? kakaoLogoBlackX : kakaoLogoBlack}
            alt="카카오 공유하기"
            width={32}
            height={32}
          />
          {isKakaoSDKLoadFailed ? "준비중" : "카카오톡"}
        </button>
        <button className="web-sharing f-center" onClick={shareOverOs}>
          {isOsShareLoading ? (
            <Loading isLoading className="mb-2" />
          ) : (
            <Share className="lg mb-1" />
          )}
          공유하기
        </button>
      </div>

      <Portal
        render={() => (
          <>
            <ErrorAlert
              isAlerting={alertMessage !== null}
              content={alertMessage}
              onClose={closeAlert}
            />
            <Toast
              isOpen={isCopied}
              style={{
                left: "10px",
                top: "calc(100dvh - 74px - 20px)",
                width: "calc(100vw - 20px)",
                height: "74px",
                color: "#000",
                fontSize: "15px",
                fontWeight: "bold",
                backgroundColor: "rgba(123, 97, 255, 0.5)",
                border: "1px solid #000",
              }}
            >
              <Bell
                className="lg mr-2 bell-icon"
                style={{position: "absolute", left: "20px"}}
              />
              클립보드에 복사되었습니다
            </Toast>
          </>
        )}
      />
    </>
  )
}

export default Sharing
