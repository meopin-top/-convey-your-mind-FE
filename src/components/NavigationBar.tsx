"use client"

import {useState, useEffect, useLayoutEffect} from "react"
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

  useLayoutEffect(() => {
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
            <span
              className={`shortcut-link f-center ${
                fullPath === ROUTE.MY_PAGE ? "active" : ""
              }`}
            >
              <Link href={ROUTE.MY_PAGE}>마이페이지</Link>
              <UserCircle className="md ml-2" />
            </span>
            <span className="shortcut-link f-center">
              <Link className="sub-link" href="#">
                참여 중인 프로젝트
              </Link>
              <WritePaper className="md ml-2" />
            </span>
            <span className="shortcut-link f-center">
              <Link className="sub-link" href="#">
                내가 받은 롤링페이퍼
              </Link>
              <LoveLetter className="md ml-2" />
            </span>
            <span className="shortcut-link f-center">
              <Link href="#">롤링페이퍼 만들기</Link>
              <Paper className="md ml-2" />
            </span>
            <div className="helper">
              <div className="helper-text">
                <Bulb className="md mt-1 mr-2 ml-4" />
                도움이 필요하신가요?
              </div>
              <div className="helper-link f-center">
                <button className="radius-md">
                  <Link href="#">FAQ</Link>
                </button>
                <button className="radius-md">
                  <Link href="#">고객센터 문의</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavigationBar
