"use client"

import {useEffect} from "react"
import {Portal, Loading} from "@/components"
import useRequest from "@/hooks/use-request"
import type {TInputChangeEvent} from "@/hooks/use-input"
import {DOMAIN} from "@/constants/service"

type TProps = {
  sharingCode: string
  handleSharingCode: (event: TInputChangeEvent) => any
  setSharingCode: (sharingCode: string) => void
}

const SharingCode = ({
  sharingCode,
  handleSharingCode,
  setSharingCode,
}: TProps) => {
  const {isLoading, request} = useRequest()

  useEffect(() => {
    async function getInviteCode() {
      const {data} = await request({
        path: "/projects/invite-code",
      })

      setSharingCode(data ?? "")
    }

    getInviteCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="sharing-code">
        <section className="description">
          롤링페이퍼의 공유 코드를 만들까요?
        </section>
        <span className="service-domain">{DOMAIN}/</span>
        <input
          className="radius-sm"
          type="text"
          placeholder="기본 코드 디폴트" // TODO: change
          value={sharingCode}
          onChange={handleSharingCode}
        />
      </div>
      <Portal render={() => <Loading isLoading={isLoading} />} />
    </>
  )
}

export default SharingCode
