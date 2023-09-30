"use client"

import {useState} from "react"
import {Portal, Alert} from "@/components"

type TProps = {
  disabled: boolean
  toWhom: string
  personnel: string
  sharedCode: string
}

const SubmitButton = ({disabled, toWhom, personnel, sharedCode}: TProps) => {
  const [isAlerting, setIsAlerting] = useState(false)

  const dataToCheck: {description: string; data: string}[] = [
    {
      description: "받는 사람",
      data: toWhom,
    },
    {
      description: "참여 인원",
      data: personnel,
    },
    {
      description: "선택한 탬플릿",
      data: sharedCode, // TODO: 템플릿으로 고치기
    },
  ]

  function handleIsAlerting() {
    setIsAlerting(!isAlerting)
  }

  function submit() {
    // TODO
    console.log("toWhom", toWhom)
    console.log("personnel", personnel)
    console.log("sharedCode", sharedCode)
  }

  return (
    <>
      <button
        className={`submit-button mt-4 radius-lg shadow-md ${
          disabled ? "disabled" : ""
        }`}
        disabled={disabled}
        onClick={handleIsAlerting}
      >
        롤링 페이퍼 만들기
      </button>

      <Portal
        render={() => (
          <Alert isAlerting={isAlerting} style={{height: "246px"}} blur>
            <Alert.Title title="마지막으로 확인해 주세요!" />
            <Alert.Content>
              <ul
                style={{
                  padding: "20px 10%",
                  lineHeight: "1.6",
                }}
              >
                {dataToCheck.map(({description, data}) => (
                  <li className="txt-ellipsis" key={description}>
                    <span style={{fontWeight: "bold"}}>· </span>
                    {description}:{" "}
                    <span style={{fontWeight: "bold"}}>{data}</span>
                  </li>
                ))}
              </ul>
              <div className="f-center">롤링페이퍼를 만들까요?</div>
            </Alert.Content>
            <Alert.ButtonWrapper style={{height: "40px", marginTop: "20px"}}>
              <Alert.Button
                onClick={submit}
                style={{width: "120px"}}
                type="fill-light-1"
              >
                시작하기
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
    </>
  )
}

export default SubmitButton
