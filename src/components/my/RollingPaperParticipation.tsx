"use client"

import {useRouter} from "next/navigation"
import dynamic from "next/dynamic"
import useInput from "@/hooks/use-input"
import useRequest from "@/hooks/use-request"
import {ROLLING_PAPER} from "@/constants/response-code"
import ROUTE from "@/constants/route"

const Portal = dynamic(() => import("../Portal"), {
  loading: () => <></>,
})
const Loading = dynamic(() => import("../Loading"), {
  loading: () => <></>,
})

const RollingPaperParticipation = () => {
  const router = useRouter()

  const [sharedCode, handleSharedCode] = useInput()

  const {isLoading, request} = useRequest()

  async function writeRollingPaper() {
    const {code} = await request({
      path: `/projects/invite-code/${encodeURIComponent(sharedCode)}`,
    })

    if (code === ROLLING_PAPER.INVITE_CODE.QUERY_SUCCESS) {
      router.push(ROUTE.MY_PAGE) // TODO: route 변경

      return
    }

    alert("참여 가능한 공유 코드가 아닙니다.")
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
        <button
          className="radius-sm"
          onClick={writeRollingPaper}
          disabled={isLoading}
        >
          참여하기
        </button>
      </div>
      <Portal render={() => <Loading isLoading={isLoading} />} />
    </>
  )
}

export default RollingPaperParticipation
