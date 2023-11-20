import {Reducer} from "@/components"
import {Provider as SignInProvider} from "@/store/sign-in"
import {Provider as SettingAuthProvider} from "@/store/setting-auth"
import "@/assets/styles/index.scss"

export const metadata = {
  title: "마음을 전해요",
  description: "by meopin top",
}

const RootLayout = ({children}: {children: JSX.Element}) => {
  return (
    <html lang="ko">
      <body>
        <Reducer components={[
          SignInProvider,
          SettingAuthProvider,
        ]}>
          {children}
        </Reducer>
        <div id="portal" />
      </body>
    </html>
  )
}

export default RootLayout
