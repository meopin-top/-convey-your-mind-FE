"use client"

import useInput from "@/hooks/use-input"

const EmailInput = () => {
  const [email, handleEmail] = useInput()

  async function inquireAccount() {
    // TODO: use-request 사용해서 API 요청 후 처리
  }

  return (
    <>
      <h2 className="mb-4">내 계정 정보 찾기</h2>
      <p>ID, PW를 잊어버리셨나요?</p>
      <p>
        가입 시 or 사용 중 <span>예비 이메일</span>을 입력하셨다면,
      </p>
      <p className="mb-4">계정 정보를 찾을 수 있습니다.</p>
      <input
        className="radius-sm mb-2 email"
        placeholder="예비 이메일 입력하기"
        value={email}
        onChange={handleEmail}
      />
      <button
        className="md shadow-sm radius-sm mb-4 inquiry-button"
        onClick={inquireAccount}
      >
        내 정보 찾기
      </button>
      <p>입력하신 이메일과 일치하는 계정 정보가 존재할 경우,</p>
      <p>
        해당 이메일로 <span className="highlight">ID 정보와 매직링크</span>를
        보내드립니다.
      </p>
      <p>* 매직링크로 로그인 하신 후 비밀번호를 변경해 주세요!</p>
    </>
  )
}

export default EmailInput
