import {Provider as SignUpTabProvider} from "@/store/sign-up-tab"
import "@/assets/styles/index.scss"

export const metadata = {
  title: "마음을 전해요",
  description: "by meopin top",
}

const RootLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="ko">
      <body>
        <SignUpTabProvider>{children}</SignUpTabProvider>
        <div id="portal" />
      </body>
    </html>
  )
}

export default RootLayout
