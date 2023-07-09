"use client"

import useInput from "@/hooks/use-input"

const WithoutSignUp = () => {
  const [sharedCode, handleSharedCode] = useInput()

  function writeRollingPaper() {
    // TODO: flow 추가되면 수정
  }

  return (
    <>
      <section>가입없이</section>
      <div className="shared-code f-center">
        <input
          className="radius-sm"
          placeholder="공유코드로 바로 편지쓰기"
          value={sharedCode}
          onChange={handleSharedCode}
        />
        <button className="radius-sm" onClick={writeRollingPaper}>
          입력
        </button>
      </div>
    </>
  )
}

export default WithoutSignUp
