import {useRouter} from "next/navigation"
import Alert from "./Alert"
import ROUTE from "@/constants/route"

type TProps = {
  isAlerting: boolean
  onClose: () => void
}

const LoginAlert = ({isAlerting, onClose}: TProps) => {
  const router = useRouter()

  function goToSignIn() {
    router.push(ROUTE.MAIN)
  }

  return (
    <Alert isAlerting={isAlerting} style={{padding: "12px"}}>
      <Alert.Content
        style={{
          width: "100%",
          margin: "10px 0",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        로그인 후 이용할 수 있는 메뉴입니다🥲
        <br />
        로그인하시겠습니까?
      </Alert.Content>
      <Alert.ButtonWrapper style={{height: "36px", marginTop: "20px"}}>
        <Alert.Button onClick={onClose} style={{width: "120px"}} type="dark-4">
          취소
        </Alert.Button>
        <Alert.Button
          onClick={goToSignIn}
          style={{width: "120px"}}
          type="fill-dark-4"
        >
          확인
        </Alert.Button>
      </Alert.ButtonWrapper>
    </Alert>
  )
}

export default LoginAlert
