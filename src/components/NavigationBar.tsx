"use client"

import {
  useState,
  useEffect,
  useContext,
  type MouseEvent,
  type ReactNode,
} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
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
import SignInStore from "@/store/sign-in"
import Storage from "@/store/local-storage"
import {ROUTE} from "@/constants/service"

const Portal = dynamic(() => import("./Portal"), {
  loading: () => <></>,
})
const LoginAlert = dynamic(() => import("./FlowAlert"), {
  loading: () => <></>,
})

const NavigationBar = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const [isLogOutCalled, setIsLogOutCalled] = useState(false)
  const [isAlerting, setIsAlerting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fullPath, setFullPath] = useState("")
  const {setTab} = useContext(SignInStore)

  const router = useRouter()

  const {lockScroll, unlockScroll} = useBodyScrollLock()

  const logOut = useLogOut()

  useEffect(() => {
    setIsLoggedIn(!!Storage.get("nickName"))
  }, [])

  useEffect(() => {
    if (isNavigationOpen) {
      lockScroll()
      setFullPath(location.pathname + location.search)
    } else {
      unlockScroll()
    }
  }, [isNavigationOpen, lockScroll, unlockScroll])

  function handleNavigationBar() {
    setIsNavigationOpen(!isNavigationOpen)
  }

  function preventPropagation(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  function handleLogOut() {
    setIsLogOutCalled(true)
    setTab("signIn")
    logOut()
  }

  function openAlert(event: MouseEvent<HTMLButtonElement>) {
    if (!isLoggedIn) {
      event.stopPropagation()

      setIsAlerting(true)
    }
  }

  function closeAlert() {
    setIsAlerting(false)
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

  function goToSignIn() {
    router.push(ROUTE.MAIN)
  }

  return (
    <>
      <Hamburger onClick={handleNavigationBar} className="md" />
      <nav
        id="navigation-bar"
        className={`${isNavigationOpen ? "open" : "close"} background`}
        onClick={handleNavigationBar}
      >
        <div className="wrapper" onClick={preventPropagation}>
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
                    onClick={handleLogOut}
                    disabled={isLogOutCalled}
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
          <LoginAlert
            isAlerting={isAlerting}
            content={
              <>
                로그인 후 이용할 수 있는 메뉴입니다🥲
                <br />
                로그인하시겠습니까?
              </>
            }
            defaultButton="취소"
            onClose={closeAlert}
            additionalButton="확인"
            onClick={goToSignIn}
          />
        )}
      />
    </>
  )
}

export default NavigationBar
