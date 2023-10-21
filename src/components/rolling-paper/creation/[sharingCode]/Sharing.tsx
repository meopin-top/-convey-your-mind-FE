"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import Loading from "@/components/Loading"
import {kakaoLogoBlack} from "@/assets/images"
import {ClipboardCheck, Clipboard, Share} from "@/assets/icons"
import {DOMAIN} from "@/constants/service"

type TProps = {
  sharingCode: string
}

const Sharing = ({sharingCode}: TProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isOsShareLoading, setIsOsShareLoading] = useState(false)

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

    let temporaryElement: HTMLSpanElement | null = null

    try {
      const isClipboardSupported = Boolean(navigator?.clipboard)
      isClipboardSupported
        ? await copyWithClipboard(SHARING_URL)
        : copyWithExecCommand(SHARING_URL)

      handleIsCopied()
    } catch (_) {
      alert("클립보드에 복사하기를 실패했습니다.")
    } finally {
      if (temporaryElement) {
        document.body.removeChild(temporaryElement)
      }
    }

    async function copyWithClipboard(text: string) {
      await navigator.clipboard.writeText(text)
    }

    function copyWithExecCommand(text: string) {
      temporaryElement = document.createElement("span")
      temporaryElement.textContent = text
      temporaryElement.style.display = "none"

      document.body.appendChild(temporaryElement)

      temporaryElement.focus()
      document.execCommand("copy")
    }
  }

  function handleIsCopied() {
    setIsCopied(true)

    timer = setTimeout(() => {
      setIsCopied(false)
    }, TIME_OUT)
  }

  async function shareOverOs() {
    const isShareSupported = Boolean(navigator?.share)

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
      alert((error as Error).message)
    } finally {
      setIsOsShareLoading(false)
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
          className="mb-2"
          src={kakaoLogoBlack}
          alt="카카오 공유하기"
          width={32}
          height={32}
        />
        카카오톡
      </button>
      <button className="web-sharing f-center" onClick={shareOverOs}>
        {isOsShareLoading ? (
          <Loading isLoading={true} className="mb-2" />
        ) : (
          <Share className="lg mb-1" />
        )}
        공유하기
      </button>
    </div>
  )
}

export default Sharing
