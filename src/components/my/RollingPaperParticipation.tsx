"use client"

import useInput from "@/hooks/use-input"

const RollingPaperParticipation = () => {
  const [sharedCode, handleSharedCode] = useInput()

  function writeRollingPaper() {
    // TODO: flow 추가되면 수정
    // TODO: WithoutSignUp.tsx와 같은 로직이 있음. 공통화 필요
  }

  return (
    <>
      <button className="rolling-paper-creation xxxl radius-sm shadow-md mb-4">
        롤링 페이퍼 새로 시작하기
      </button>
      <span className="shared-code-description">
        롤링페이퍼의 공유 코드를 알고 계신가요?
      </span>
      <div className="shared-code f-center">
        <input
          className="radius-sm"
          placeholder="공유코드 or URL을 입력해 주세요"
          value={sharedCode}
          onChange={handleSharedCode}
        />
        <button className="radius-sm" onClick={writeRollingPaper}>
          참여하기
        </button>
      </div>
    </>
  )
}

export default RollingPaperParticipation
