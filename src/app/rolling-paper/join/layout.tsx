import Script from "next/script"

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {children}
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.2.0/kakao.min.js" />
    </>
  )
}

export default Layout
