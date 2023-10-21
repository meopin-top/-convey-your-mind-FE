"use client"

import {useEffect, useContext} from "react"
import {Portal, Loading} from "@/components"
import {SharingCodeStore} from "@/components/rolling-paper/creation/Context"
import useRequest from "@/hooks/use-request"
import type {TInputChangeEvent} from "@/hooks/use-input"
import {DOMAIN} from "@/constants/service"

type TProps = {}

const SharingCode = ({}: TProps) => {
  const {sharingCode, handleSharingCode} = useContext(SharingCodeStore)
  const {isLoading, request} = useRequest()

  useEffect(() => {
    async function getInviteCode() {
      const {data} = await request({
        path: "/projects/invite-code"
      })

      handleSharingCode({
        target: {value: data ?? ""}
      } as TInputChangeEvent)
    }

    getInviteCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="sharing-code">
        <section className="description mb-1">
          롤링페이퍼의 공유 코드는 무엇인가요?
        </section>
        <section className="sub-description mb-1">
          * 기본 코드를 수정할 수 있습니다(빈 칸일 경우 진행 불가).
        </section>
        <span className="service-domain">{DOMAIN}/</span>
        <input
          className="radius-sm"
          type="text"
          placeholder="공유 코드를 입력해주세요"
          value={sharingCode}
          onChange={handleSharingCode}
        />
      </div>
      <Portal render={() => <Loading isLoading={isLoading} />} />
    </>
  )
}

export default SharingCode
