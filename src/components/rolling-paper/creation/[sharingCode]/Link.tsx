"use client"

import {useLayoutEffect} from "react"
import Anchor from "next/link"
import {DOMAIN} from "@/constants/service"

type TProps = {
  sharingCode: string
}

const Link = ({sharingCode}: TProps) => {
  useLayoutEffect(() => {
    // TODO: API 요청 후 sharingCode가 존재하는지 확인
    // 존재하지 않으면 메인 페이지로 redirect
  }, [])

  return (
    <div className="link f-center mt-4">
      <span className="mb-2">
        링크를 공유하여 롤링페이퍼를 함께 작성해 보세요!
      </span>
      <Anchor href={sharingCode}>
        {DOMAIN}/{sharingCode}
      </Anchor>
    </div>
  )
}

export default Link
