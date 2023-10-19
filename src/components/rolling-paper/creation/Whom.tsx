"use client"

import {useContext} from "react"
import {WhomStore} from "@/components/rolling-paper/creation/Context"

type TProps = {}

const Whom = ({}: TProps) => {
  const {toWhom, handleToWhom} = useContext(WhomStore)

  return (
    <div className="whom">
      <section className="description">누구에게 보내는 편지인가요?</section>
      <input
        className="mt-4 radius-sm"
        type="text"
        placeholder="받는 사람 이름 입력"
        value={toWhom}
        onChange={handleToWhom}
        maxLength={30}
      />
    </div>
  )
}

export default Whom
