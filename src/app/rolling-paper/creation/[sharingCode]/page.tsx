import {Suspense} from "react"
import {redirect} from "next/navigation"
import Anchor from "next/link"
import {Link, Sharing} from "@/components/rolling-paper/creation/[sharingCode]"
import {Header, Loading, NeedLoggedIn} from "@/components"
import {ROUTE} from "@/constants/service"
import {ROLLING_PAPER} from "@/constants/response-code"

type TProps = {
  params: {
    sharingCode: string
  }
}

async function validateSharingCode(sharingCode: string) {
  const data = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_HOST
    }/api/projects/invite-code/${encodeURIComponent(sharingCode)}`,
    {next: {revalidate: 10}}
  )
  const {code} = await data.json()
  if (code === ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE) {
    // 존재하지 않는 공유 코드면
    redirect(ROUTE.MY_PAGE)
  }
}

const CreationSuccess = async ({params: {sharingCode}}: TProps) => {
  await validateSharingCode(sharingCode)

  return (
    <Suspense fallback={<Loading isLoading />}>
      <NeedLoggedIn />

      <main className="creation-success root-wrapper">
        <Header />

        <div className="title f-center mt-2">
          <h2>롤링페이퍼 만들기</h2>
          <h1>성공!</h1>
        </div>
        <Link sharingCode={`${ROUTE.ROLLING_PAPER_EDIT}/${sharingCode}`} />
        <Sharing sharingCode={`${ROUTE.ROLLING_PAPER_EDIT}/${sharingCode}`} />
        <button className="to-rolling-paper mt-4 radius-lg shadow-md">
          <Anchor
            href={`${ROUTE.ROLLING_PAPER_EDIT}/${sharingCode}`}
            className="f-center"
          >
            롤링 페이퍼 쓰러 가기
          </Anchor>
        </button>
        <button className="to-my-page mt-4 radius-lg shadow-md">
          <Anchor href={ROUTE.MY_PAGE} className="f-center">
            마이 페이지
          </Anchor>
        </button>
      </main>
    </Suspense>
  )
}

export default CreationSuccess
