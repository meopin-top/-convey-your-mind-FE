"use client"

import {useState} from "react"
import {Portal, Alert} from "@/components"
import type {THandleValue} from "@/hooks/use-input"

type TProps = {
  personnel: string
  handlePersonnel: THandleValue
}

const Personnel = ({personnel, handlePersonnel}: TProps) => {
  const [isAlerting, setIsAlerting] = useState(false)

  function handleIsAlerting() {
    setIsAlerting(!isAlerting)
  }

  // TODO: 확정하기 클릭 시 handlePersonnel 관련해서 state 관리 추가

  return (
    <div className="personnel">
      <section className="description">
        롤링페이퍼 참여 인원은 몇 명인가요?
      </section>
      <div className="selection f-center mt-2">
        <div>
          <input
            className="radius-sm mr-2"
            type="number"
            value={personnel}
            onChange={handlePersonnel}
          />
          <span>명</span>
        </div>
        <span>or</span>
        <button
          className="not-determined xxs radius-md"
          onClick={handleIsAlerting}
        >
          미정
        </button>
      </div>
      <section className="caution mt-1">
        * 참여 인원 수정이 어려우니 다시 한 번 확인해 주세요!
      </section>

      <Portal
        render={() => (
          <Alert isAlerting={isAlerting} style={{height: "160px"}}>
            <Alert.Content
              style={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              롤링페이퍼 참여 인원이 미정일 경우,
              <br />
              일부 템플릿을 사용할 수 없습니다.
              <br />
              참여 인원을 <span className="highlight">{"'미정'"}</span>
              으로 확정하시겠습니까?
            </Alert.Content>
            <Alert.ButtonWrapper style={{height: "40px", marginTop: "20px"}}>
              <Alert.Button
                onClick={handleIsAlerting}
                style={{width: "120px"}}
                type="fill-light-1"
              >
                확정하기
              </Alert.Button>
              <Alert.Button
                onClick={handleIsAlerting}
                type="default"
                style={{width: "120px"}}
              >
                취소
              </Alert.Button>
            </Alert.ButtonWrapper>
          </Alert>
        )}
      />
    </div>
  )
}

export default Personnel
