"use client"

import {useContext} from "react"
import {Alert} from "@/components"
// import useRequest from "@/hooks/use-request"
import {
  WhomStore,
  PersonnelStore,
  TypeStore,
  DDayStore,
  SharingCodeStore
} from "@/components/rolling-paper/creation/Context"
import {formatDateTime} from "@/utils/formatter"
import {calculateDateOffset} from "@/utils/date"

type TProps = {
  isAlerting: boolean
  onClose: () => void
}

const ConfirmedPopUp = ({isAlerting, onClose}: TProps) => {
  const {toWhom} = useContext(WhomStore)
  const {personnel} = useContext(PersonnelStore)
  const {type} = useContext(TypeStore)
  const {dDay} = useContext(DDayStore)
  const {sharingCode} = useContext(SharingCodeStore)

  const dataToCheck: {description: string; data: string}[] = [
    {
      description: "받는 사람",
      data: toWhom
    },
    {
      description: "참여 인원",
      data: personnel
    },
    {
      description: "선택한 탬플릿",
      data: type?.text ?? ""
    },
    {
      description: "마감일",
      data: `${formatDateTime(calculateDateOffset(dDay))} (D-${dDay})`
    }
  ]

  function submit() {
    // TODO: personnel === "" => 0으로 수정해서
    // TODO: expiredAt === "9999-12-31" => null로 수정해서
    console.log("toWhom", toWhom)
    console.log("personnel", personnel)
    console.log("sharingCode", sharingCode)
  }

  return (
    <Alert
      isAlerting={isAlerting}
      style={{height: "256px"}}
      blur
    >
      <Alert.Title
        title="마지막으로 확인해 주세요!"
        style={{fontFamily: "hanna-11-years"}}
      />
      <Alert.Content>
        <ul
          style={{
            padding: "20px 10%",
            lineHeight: "1.6"
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
          onClick={onClose}
          type="default"
          style={{width: "120px"}}
        >
          취소
        </Alert.Button>
        <Alert.Button
          onClick={submit}
          style={{width: "120px"}}
          type="fill-light-1"
        >
          시작하기
        </Alert.Button>
      </Alert.ButtonWrapper>
    </Alert>
  )
}

export default ConfirmedPopUp