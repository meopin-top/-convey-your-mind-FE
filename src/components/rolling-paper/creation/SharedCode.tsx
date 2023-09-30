"use client"

import type {THandleValue} from "@/hooks/use-input"

type TProps = {
  sharedCode: string
  handleSharedCode: THandleValue
}

const SharedCode = ({sharedCode, handleSharedCode}: TProps) => {
  return (
    <div className="shared-code">
      <section className="description">
        롤링페이퍼의 공유 코드를 만들까요?
      </section>
      <span className="service-domain">www.conveyyourmind.com/</span>
      <input
        className="radius-sm"
        type="text"
        placeholder="기본 코드 디폴트" // TODO: change
        value={sharedCode}
        onChange={handleSharedCode}
      />
    </div>
  )
}

export default SharedCode
