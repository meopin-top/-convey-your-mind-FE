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

const WithoutSignUp = () => {
  const router = useRouter()

  const [sharedCode, handleSharedCode] = useInput()

  const {isLoading, request} = useRequest()

  async function writeRollingPaper() {
    const {code} = await request({
      path: `/projects/invite-code/${encodeURIComponent(sharedCode)}`,
    })

    if (code === ROLLING_PAPER.INVITE_CODE.QUERY_SUCCESS) {
      router.push(ROUTE.MAIN) // TODO: route 변경

      return
    }

    alert("참여 가능한 공유 코드가 아닙니다.")
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
        <button
          className="radius-sm"
          onClick={writeRollingPaper}
          disabled={isLoading}
        >
          입력
        </button>
      </div>
      <Portal render={() => <Loading isLoading={isLoading} />} />
    </>
  )
}

export default WithoutSignUp
