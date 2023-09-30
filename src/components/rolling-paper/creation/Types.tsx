"use client"

import {Type} from "@/components/rolling-paper/creation"

const Types = () => {
  // TODO: state 관리. Type 클릭하면 어떻게 되는건지 알고 난 뒤에 개발하기

  return (
    <div className="types">
      <section className="description">어떤 롤링페이퍼를 만들까요?</section>
      <div className="type-wrapper mt-4">
        <Type recommendationText="n명 이하 추천">
          큰 종이에
          <br />
          자유롭게 편지쓰기
        </Type>
        <Type recommendationText="많은 인원 추천">
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
