import Anchor from "next/link"
import {Link, Sharing} from "@/components/rolling-paper/creation/[sharingCode]"
import ROUTE from "@/constants/route"

type TProps = {
  params: {
    sharingCode: string
  }
}

const CreationSuccess = ({params}: TProps) => {
  return (
    <main className="creation-success root-wrapper">
      <div className="title f-center">
        <h2>롤링페이퍼 만들기</h2>
        <h1>성공!</h1>
      </div>
      <Link sharingCode={params.sharingCode} />
      <Sharing sharingCode={params.sharingCode} />
      <button className="to-rolling-paper mt-4 radius-lg shadow-md">
        <Anchor href={ROUTE.LOGIN} className="f-center">
          롤링 페이퍼 쓰러 가기{/* TODO: href 변경 */}
        </Anchor>
      </button>
      <button className="to-my-page mt-4 radius-lg shadow-md">
        <Anchor href={ROUTE.LOGIN} className="f-center">
          마이 페이지{/* TODO: href 변경 */}
        </Anchor>
      </button>
    </main>
  )
}

export default CreationSuccess
