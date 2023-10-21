// TODO: useRouter <- 비밀번호 일치 시 내 설정 페이지로 이동
import type {KeyboardEvent} from "react"
import {Alert, SecretInput, Portal} from "../"
import useInput from "@/hooks/use-input"
// TODO: useRequest <- 비밀번호 확인 API 호출
// TODO: FlowAlert <- 비밀번호가 일치하지 않습니다.

type TProps = {
  isAlerting: boolean
  onClose: () => void
}

const SettingConfirmAlert = ({isAlerting, onClose}: TProps) => {
  const [password, handlePassword] = useInput()

  function handlePasswordInput(event: KeyboardEvent<HTMLInputElement>) {
    const isEnterKeyDowned = event.key === "Enter"
    if (isEnterKeyDowned) {
      //   signIn()
    }
  }

  return (
    <Portal
      render={() => (
        <Alert isAlerting={isAlerting} blur>
          <Alert.Title title="내 설정 접근" />
          <Alert.Content style={{textAlign: "center"}}>
            <div className="mt-1 mb-2">
              보안을 위해 현재 비밀번호를 입력해 주세요.
            </div>
            <SecretInput
              className="radius-sm mb-2"
              placeholder="비밀번호를 입력해 주세요"
              minLength={1}
              maxLength={100}
              required
              value={password}
              onKeyDown={handlePasswordInput}
              onChange={handlePassword}
            />
          </Alert.Content>
          <Alert.ButtonWrapper style={{columnGap: "4px"}}>
            <Alert.Button
              onClick={onClose}
              type="dark-4"
              style={{flex: "1 0 120px", height: "32px"}}
            >
              취소
            </Alert.Button>
            <Alert.Button
              onClick={() => {}}
              type="fill-dark-4"
              style={{flex: "1 0 120px", height: "32px"}}
            >
              확인하기
            </Alert.Button>
          </Alert.ButtonWrapper>
        </Alert>
      )}
    />
  )
}

export default SettingConfirmAlert
