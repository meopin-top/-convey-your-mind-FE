import Anchor from "next/link"
import {DOMAIN} from "@/constants/service"

type TProps = {
  sharingCode: string
}

const Link = ({sharingCode}: TProps) => {
  return (
    <div className="link f-center mt-4">
      <span className="mb-2">
        링크를 공유하여 롤링페이퍼를 함께 작성해 보세요!
      </span>
      <Anchor href={encodeURI(sharingCode)}>
        {DOMAIN}/{decodeURI(sharingCode)}
      </Anchor>
    </div>
  )
}

export default Link
