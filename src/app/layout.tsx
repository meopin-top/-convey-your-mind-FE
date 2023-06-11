import "@/assets/styles/app.scss"

export const metadata = {
  title: "마음을 전해요",
  description: "by meopin top",
}

const RootLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="ko">
      <body>
        {children}
        <div id="portal" />
      </body>
    </html>
  )
}

export default RootLayout
