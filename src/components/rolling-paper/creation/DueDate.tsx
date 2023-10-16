"use client"

import {useState, useMemo, type FormEvent, type KeyboardEvent} from "react"
import type {TInputChangeEvent} from "@/hooks/use-input"
import {formatDateTime} from "@/utils/formatter"
import {calculateDDay, calculateDateOffset} from "@/utils/date"
import {DISTANT_FUTURE_D_DAY} from "@/constants/date"
import type {TDueDateType} from "@/@types/rolling-paper"

type TProps = {
  dDay: number
  handleDDay: (dDay: number) => void
}

const DueDate = ({dDay, handleDDay}: TProps) => {
  const [type, setType] = useState<TDueDateType>("DATE")

  const initialDDay = useMemo(
    () => dDay,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const dueDate = useMemo(
    () => formatDateTime(calculateDateOffset(dDay)),
    [dDay]
  )

  const MIN = 1
  const MAX = 999

  function preventEvent(event: KeyboardEvent<HTMLInputElement>) {
    event.preventDefault()
  }

  function handleType(event: FormEvent<HTMLFieldSetElement>) {
    const type = (event.target as HTMLInputElement).value as TDueDateType

    setType(type)
    if (type === "NONE") {
      handleDDay(DISTANT_FUTURE_D_DAY)
    } else {
      handleDDay(initialDDay)
    }
  }

  function changeDate(event: TInputChangeEvent) {
    const date = new Date(event.target.value)
    handleDDay(calculateDDay(date))
  }

  function changeDDay(event: TInputChangeEvent) {
    const dDay = parseInt(event.target.value)
    if (isNaN(dDay)) {
      handleDDay(0)

      return
    }

    if (dDay > MAX || dDay < MIN || !/^[0-9]*$/.test(event.target.value)) {
      return
    }

    if (event.target.value.startsWith("0")) {
      // dDay가 0이었을 때 사용자가 입력했다면
      const relevantDDay = event.target.value.slice(1)
      event.target.value = relevantDDay

      handleDDay(parseInt(relevantDDay))
    } else {
      handleDDay(dDay)
    }
  }

  return (
    <div className="due-date">
      <section className="description mb-1">
        언제까지 롤링페이퍼를 작성하실 건가요?
      </section>
      <fieldset className="selection mb-2" onChange={handleType}>
        <legend className="sub-description mb-2">
          * 롤링페이퍼 전달 예정일을 설정해주세요!
        </legend>
        <label className={`${type === "DATE" ? "checked" : "disabled"} option`}>
          <input type="radio" name="due-date" value="DATE" />
          <span className="ml-1">날짜</span>
        </label>
        <label
          className={`${type === "D_DAY" ? "checked" : "disabled"} option`}
        >
          <input type="radio" name="due-date" value="D_DAY" />
          <span className="ml-1">D-DAY</span>
        </label>
        <label className={`${type === "NONE" ? "checked" : "disabled"} option`}>
          <input type="radio" name="due-date" value="NONE" />
          <span className="ml-1">설정 안 함</span>
        </label>
      </fieldset>
      <div className="datetime">
        {type === "DATE" && (
          <>
            <input
              className="radius-sm mr-1"
              type="date"
              value={dueDate}
              onChange={changeDate}
              onKeyDown={preventEvent}
            />
            <span className="mr-2">일 까지 작성하기</span>
            <span className="highlight">(D-{dDay})</span>
          </>
        )}
        {type === "D_DAY" && (
          <>
            <span>오늘부터</span>
            <input
              className="radius-sm ml-1 mr-1"
              type="number"
              value={dDay}
              onChange={changeDDay}
              min={MIN}
              max={MAX}
            />
            <span className="mr-2">일 되는 날까지 작성하기</span>
            <span className="highlight">{dueDate}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default DueDate
