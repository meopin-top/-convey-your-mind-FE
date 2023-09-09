"use client"

import {useState, useEffect} from "react"
import Link from "next/link"
import {UserInformation} from "./my"
import useBodyScrollLock from "@/hooks/use-body-scroll-lock"
import {
  Hamburger,
  Close,
  UserCircle,
  WritePaper,
  LoveLetter,
  Paper,
  Bulb,
} from "@/assets/icons"
import ROUTE from "@/constants/route"

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [fullPath, setFullPath] = useState("")

  const {lockScroll, unlockScroll} = useBodyScrollLock()

  useEffect(() => {
    setFullPath(location.pathname + location.search)
  }, [])

  useEffect(() => {
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }, [isOpen, lockScroll, unlockScroll])

  const handleNavigationBar = () => {
    setIsOpen(!isOpen)
  }

  // TODO: logout API 연동

  return (
    <>
      <Hamburger onClick={handleNavigationBar} className="md" />
      <nav
        id="navigation-bar"
        className={`${isOpen ? "open" : "close"} background`}
        onClick={handleNavigationBar}
      >
        <div className="wrapper">
          <div className="close">
            <button onClick={handleNavigationBar}>
              <Close className="sm" />
            </button>
          </div>
          <div className="content">
            <UserInformation
              right={
                <button className="log-out xxxs radius-sm mt-2">
                  로그아웃
                </button>
              }
            />
            <Link
              href={ROUTE.MY_PAGE}
              className={`shortcut-link f-center ${
                fullPath === ROUTE.MY_PAGE ? "active" : ""
              }`}
            >
              마이페이지
              <UserCircle className="md ml-2" />
            </Link>
            <Link className="shortcut-link" href={ROUTE.MY_PROJECTS}>
              ㄴ 참여 중인 프로젝트
              <WritePaper className="md ml-2" />
            </Link>
            <Link className="shortcut-link" href={ROUTE.MY_ROLLING_PAPERS}>
              ㄴ 내가 받은 롤링페이퍼
              <LoveLetter className="md ml-2" />
            </Link>
            <Link
              className={`shortcut-link f-center ${
                fullPath === "#" ? "active" : ""
              }`}
              href="#"
            >
              롤링페이퍼 만들기
              <Paper className="md ml-2" />
            </Link>
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
    </>
  )
}

export default NavigationBar
