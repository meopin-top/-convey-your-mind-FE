import {redirect} from "next/navigation"
import {Canvas, Redirection} from "@/components/rolling-paper/edit"
import {ROLLING_PAPER} from "@/constants/response-code"
import {ROUTE} from "@/constants/service"
import {Suspense} from "react"
import {Redirecting} from "@/components"

type TProps = {
  params: {
    sharingCode: string
  }
}

async function validateSharingCode(sharingCode: string) {
  const encodedSharingCode = encodeURIComponent(sharingCode)
  const sharingCodeData = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/projects/invite-code/${encodedSharingCode}`,
    {next: {revalidate: 10}}
  )
  const {
    code: sharingCodeCode,
    data: {id},
  } = await sharingCodeData.json()
  if (sharingCodeCode === ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE) {
    // 존재하지 않는 공유코드면
    redirect(ROUTE.MY_PAGE)
  }

  const projectIdData = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/projects/${id}`,
    {
      next: {
        revalidate: 10,
      },
    }
  )
  const {code: projectIdCode} = await projectIdData.json()

  return {id, projectIdCode}
}

const RollingPaperEdit = async ({params: {sharingCode}}: TProps) => {
  const {id: projectId, projectIdCode: code} = await validateSharingCode(
    sharingCode
  )

  return (
    <Suspense fallback={<Redirecting isRedirecting />}>
      {code === ROLLING_PAPER.INVITATION_CODE.QUERY_FAILURE ? (
        <Redirection sharingCode={sharingCode} />
      ) : (
        <Canvas projectId={projectId} />
      )}
    </Suspense>
  )
}

export default RollingPaperEdit
