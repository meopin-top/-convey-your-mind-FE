"use client"

import type {THandleValue} from "@/hooks/use-input"

type TProps = {
  sharingCode: string
  handleSharingCode: THandleValue
}

const SharingCode = ({sharingCode, handleSharingCode}: TProps) => {
  return (
    <div className="sharing-code">
      <section className="description">
        롤링페이퍼의 공유 코드를 만들까요?
      </section>
      <span className="service-domain">www.conveyyourmind.com/</span>
      <input
        className="radius-sm"
        type="text"
        placeholder="기본 코드 디폴트" // TODO: change
        value={sharingCode}
        onChange={handleSharingCode}
      />
    </div>
  )
}

export default SharingCode
