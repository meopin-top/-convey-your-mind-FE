import {Provider as SignInProvider} from "@/store/sign-in"
import "@/assets/styles/index.scss"

export const metadata = {
  title: "마음을 전해요",
  description: "by meopin top",
}

const RootLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="ko">
      <body>
        <SignInProvider>{children}</SignInProvider>
        <div id="portal" />
      </body>
    </html>
  )
}

export default RootLayout
