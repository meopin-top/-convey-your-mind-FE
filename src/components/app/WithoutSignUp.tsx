"use client"

import useInput from "@/hooks/use-input"

const WithoutSignUp = () => {
  const [sharedCode, handleSharedCode] = useInput()

  // TODO: 버튼 추가될 듯

  return (
    <>
      <section>가입없이</section>
      <input
        className="shared-code radius-sm"
        placeholder="공유코드로 바로 편지쓰기"
        value={sharedCode}
        onChange={handleSharedCode}
      />
    </>
  )
}

export default WithoutSignUp
