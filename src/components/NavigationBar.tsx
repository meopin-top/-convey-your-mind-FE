"use client"

import {
  useState,
  useEffect,
  useContext,
  type MouseEvent,
  type ReactNode,
} from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import {UserInformation} from "./my"
import useBodyScrollLock from "@/hooks/use-body-scroll-lock"
import useLogOut from "@/hooks/use-log-out"
import {
  Hamburger,
  Close,
  UserCircle,
  WritePaper,
  LoveLetter,
  Paper,
  Bulb,
} from "@/assets/icons"
import SignUpTabStore from "@/store/sign-up-tab"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

const Portal = dynamic(() => import("./Portal"), {
  loading: () => <></>,
})
const LoginAlert = dynamic(() => import("./LoginAlert"), {
  loading: () => <></>,
})

const NavigationBar = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fullPath, setFullPath] = useState("")
  const {setSignUpTab: setTab} = useContext(SignUpTabStore)

  const {lockScroll, unlockScroll} = useBodyScrollLock()

  const logOut = useLogOut()

  useEffect(() => {
    setFullPath(location.pathname + location.search)
    setIsLoggedIn(Boolean(Storage.get("nickName")))
  }, [])

  useEffect(() => {
    isNavigationOpen ? lockScroll() : unlockScroll()
  }, [isNavigationOpen, lockScroll, unlockScroll])

  function handleNavigationBar() {
    setIsNavigationOpen(!isNavigationOpen)
  }

  function openAlert(event: MouseEvent<HTMLButtonElement>) {
    if (!isLoggedIn) {
      event.stopPropagation()

      setIsAlertOpen(true)
    }
  }

  function closeAlert() {
    setIsAlertOpen(false)
  }

  function renderAuthorizedLink({
    route,
    children,
  }: {
    route: string
    children: ReactNode
  }) {
    return isLoggedIn ? (
      <Link
        href={route}
        className={`shortcut-link f-center ${
          fullPath === route ? "active" : ""
        }`}
        onClick={handleNavigationBar}
      >
        {children}
      </Link>
    ) : (
      <button
        onClick={openAlert}
        className={`shortcut-link f-center ${
          fullPath === route ? "active" : ""
        }`}
      >
        {children}
      </button>
    )
  }

  return (
    <>
      <Hamburger onClick={handleNavigationBar} className="md" />
      <nav
        id="navigation-bar"
        className={`${isNavigationOpen ? "open" : "close"} background`}
        onClick={handleNavigationBar}
      >
        <div className="wrapper" onClick={(event) => event.stopPropagation()}>
          <div className="close">
            <button onClick={handleNavigationBar}>
              <Close className="sm" />
            </button>
          </div>
          <div className="content">
            {isLoggedIn ? (
              <UserInformation
                right={
                  <button
                    onClick={logOut}
                    className="log-out xxs radius-sm mt-2"
                  >
                    로그아웃
                  </button>
                }
              />
            ) : (
              <div className="being-user">
                <span>더욱 쉽게 편지쓰기,</span>
                <span>Convey your mind와 함께하세요😄</span>
                <div className="link f-center mt-4">
                  <button
                    className="sign-up xxs radius-sm"
                    onClick={() => setTab("signUp")}
                  >
                    <Link href={ROUTE.MAIN}>회원가입</Link>
                  </button>
                  <button
                    className="sign-in xxs radius-sm"
                    onClick={() => setTab("signIn")}
                  >
                    <Link href={ROUTE.MAIN}>로그인</Link>
                  </button>
                </div>
              </div>
            )}
            {renderAuthorizedLink({
              route: ROUTE.MY_PAGE,
              children: (
                <>
                  마이페이지
                  <UserCircle className="md ml-2" />
                </>
              ),
            })}
            {renderAuthorizedLink({
              route: ROUTE.MY_PROJECTS,
              children: (
                <>
                  ㄴ 참여 중인 프로젝트
                  <WritePaper className="md ml-2" />
                </>
              ),
            })}
            {renderAuthorizedLink({
              route: ROUTE.MY_ROLLING_PAPERS,
              children: (
                <>
                  ㄴ 내가 받은 롤링페이퍼
                  <LoveLetter className="md ml-2" />
                </>
              ),
            })}
            {renderAuthorizedLink({
              route: "#",
              children: (
                <>
                  롤링페이퍼 만들기
                  <Paper className="md ml-2" />
                </>
              ),
            })}
            <div className="helper">
              <div className="helper-text">
                <Bulb className="md mt-1 mr-2 ml-4" />
                도움이 필요하신가요?
              </div>
              <div className="helper-link f-center">
                <Link href="#" className="f-center radius-md">
                  FAQ
                </Link>
                <Link href="#" className="f-center radius-md">
                  고객센터 문의
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Portal
        render={() => (
          <LoginAlert isAlerting={isAlertOpen} onClose={closeAlert} />
        )}
      />
    </>
  )
}

export default NavigationBar
