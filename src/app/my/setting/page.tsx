import {Suspense} from "react"
import {headers} from "next/headers"
import {redirect} from "next/navigation"
import {Header, Loading, Reducer} from "@/components"
import {AuthChecker, QuitAlert, Content} from "@/components/my/setting"
import {
  UserIdProvider,
  PasswordProvider,
  NicknameProvider,
  EmailProvider,
  ProfileProvider,
} from "@/components/my/setting/Context"
import {ROUTE} from "@/constants/service"

// 무조건 마이페이지에서만 넘어올 수 있기 때문에 별도 로그인 체크는 하지 않음
const MySetting = () => {
  const referer = headers().get("referer")

  if (process.env.NODE_ENV !== "development") {
    if (!referer) {
      redirect(ROUTE.MY_PAGE)
    }

    const isNotFromMyPage =
      !(referer as string).endsWith(ROUTE.MY_PAGE) &&
      !(referer as string).endsWith(ROUTE.MY_SETTING) &&
      !(referer as string).endsWith(ROUTE.MY_SETTING_PROFILE)
    if (isNotFromMyPage) {
      redirect(ROUTE.MY_PAGE)
    }
  }

  return (
    <Suspense fallback={<Loading isLoading />}>
      <AuthChecker />
      <QuitAlert />

      <div className="my-setting root-wrapper">
        <Header />

        <section className="title mb-4">
          <h2>내 설정</h2>
          <span>모든 변경 사항은 저장하기 완료 후에 반영됩니다.</span>
        </section>

        <Reducer
          components={[
            UserIdProvider,
            PasswordProvider,
            ProfileProvider,
            NicknameProvider,
            EmailProvider,
          ]}
        >
          <main className="main">
            <Content />
          </main>
        </Reducer>
      </div>
    </Suspense>
  )
}

export default MySetting
