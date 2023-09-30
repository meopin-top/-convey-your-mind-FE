"use client"

import type {THandleValue} from "@/hooks/use-input"

type TProps = {
  toWhom: string
  handleToWhom: THandleValue
}

const Whom = ({toWhom, handleToWhom}: TProps) => {
  return (
    <div className="whom">
      <section className="description">누구에게 보내는 편지인가요?</section>
      <input
        className="mt-4 radius-sm"
        type="text"
        placeholder="받는 사람 이름 입력"
        value={toWhom}
        onChange={handleToWhom}
      />
    </div>
  )
}

export default Whom
