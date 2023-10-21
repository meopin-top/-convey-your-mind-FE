"use client"

import {useContext, type MouseEvent} from "react"
import {Type} from "@/components/rolling-paper/creation"
import {TypeStore} from "@/components/rolling-paper/creation/Context"

type TProps = {}

const Types = ({}: TProps) => {
  const {type, handleType} = useContext(TypeStore)

  function setType(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLDivElement)) {
      return
    }

    const template = event.target.dataset.type
    if (!template) {
      return
    }

    const innerTexts = event.target.innerText.split("\n")
    const text = innerTexts.slice(0, innerTexts.length - 1).join(" ")

    handleType({
      template,
      text
    })
  }

  return (
    <div className="types">
      <section className="description">어떤 롤링페이퍼를 만들까요?</section>
      <div className="type-wrapper mt-4" onClick={setType}>
        <Type
          recommendationText="n명 이하 추천"
          type="D"
          isSelected={type?.template === "D"}
        >
          큰 종이에
          <br />
          자유롭게 편지쓰기
        </Type>
        <Type recommendationText="많은 인원 추천" isReady={false}>
          포스트잇으로
          <br />
          깔끔하게 만들기
        </Type>
        <Type recommendationText="1명 추천" isReady={false}>
          어드벤트 캘린더로
          <br />
          만들기
        </Type>
        <Type isReady={false}>
          내 맘대로
          <br />
          커스텀 하기
        </Type>
      </div>
    </div>
  )
}

export default Types
