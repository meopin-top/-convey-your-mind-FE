const CustomerService = () => {
  // TODO: 고객센터 운영을 안 한다면 삭제

  return (
    <>
      <p className="f-center pl-2 pr-2 mb-1 radius-xl guide">
        😅 예비 이메일을 입력하지 않으셨나요?
      </p>
      <p className="mb-2">${`{찾기 불가 안내 텍스트}`}</p>
      <button className="md radius-sm shadow-md customer-service">
        고객센터 문의
      </button>
    </>
  )
}

export default CustomerService
