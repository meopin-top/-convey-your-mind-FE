"use client"

import {useState, useContext} from "react"
import {useRouter} from "next/navigation"
import dynamic from "next/dynamic"
import {Alert, Loading} from "@/components"
import useRequest from "@/hooks/use-request"
import {
  WhomStore,
  PersonnelStore,
  TypeStore,
  DDayStore,
  SharingCodeStore,
} from "@/components/rolling-paper/creation/Context"
import {formatDateTime} from "@/utils/formatter"
import {calculateDateOffset} from "@/utils/date"
import {ROLLING_PAPER} from "@/constants/response-code"
import ROUTE from "@/constants/route"

const ErrorAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

type TProps = {
  isAlerting: boolean
  onClose: () => void
}

const ConfirmedPopUp = ({isAlerting, onClose}: TProps) => {
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const {toWhom} = useContext(WhomStore)
  const {personnel} = useContext(PersonnelStore)
  const {type} = useContext(TypeStore)
  const {dDay} = useContext(DDayStore)
  const {sharingCode} = useContext(SharingCodeStore)

  const {isLoading, request} = useRequest()

  const router = useRouter()

  const dataToCheck: {description: string; data: string}[] = [
    {
      description: "받는 사람",
      data: toWhom,
    },
    {
      description: "참여 인원",
      data: personnel === "" ? "0명" : `${personnel}명`,
    },
    {
      description: "선택한 탬플릿",
      data: type?.text ?? "",
    },
    {
      description: "마감일",
      data:
        dDay === Infinity
          ? "무기한 (D-∞)"
          : `${formatDateTime(calculateDateOffset(dDay))} (D-${dDay})`,
    },
  ]

  async function submit() {
    const {code, data} = await request({
      path: "/projects",
      method: "post",
      body: {
        destination: toWhom,
        maxInviteNum: personnel === "" ? 0 : parseInt(personnel),
        type: type!.template,
        expiredDatetime:
          dDay === Infinity
            ? null
            : formatDateTime(calculateDateOffset(dDay), true),
        inviteCode: sharingCode,
      },
    })

    if (code === ROLLING_PAPER.CREATION.DUPLICATED_SHARING_CODE) {
      setIsErrorAlertOpen(true)
      setAlertMessage("이미 존재하는 공유코드입니다.")

      return
    }

    if (code === ROLLING_PAPER.CREATION.FAILURE) {
      setIsErrorAlertOpen(true)
      setAlertMessage("롤링페이퍼를 생성하는 데 실패했습니다.")

      return
    }

    router.push(`${ROUTE.ROLLING_PAPER_CREATION}/${data.inviteCode}`)
  }

  function closeErrorAlert() {
    setIsErrorAlertOpen(false)
    setAlertMessage("")
  }

  return (
    <>
      <Alert isAlerting={isAlerting} style={{height: "256px"}} blur>
        <Alert.Title
          title="마지막으로 확인해주세요!"
          style={{fontFamily: "hanna-11-years"}}
        />
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
                {description}: <span style={{fontWeight: "bold"}}>{data}</span>
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
      <Loading isLoading={isLoading} />
      <ErrorAlert
        isAlerting={isErrorAlertOpen}
        onClose={closeErrorAlert}
        content={alertMessage}
      />
    </>
  )
}

export default ConfirmedPopUp
