"use client"

import {useContext, type MouseEvent} from "react"
import {SignIn, SignUp} from "./"
import SignUpTabStore from "@/store/sign-up-tab"
import type {TTab} from "@/@types/sign-up-tab"

const WithSignUp = () => {
  const {signUpTab: tab, setSignUpTab: setTab} = useContext(SignUpTabStore)

  function handleTab(event: MouseEvent) {
    setTab(event.currentTarget.getAttribute("data-tab") as TTab)
  }

  return (
    <>
      <section>or</section>
      <section className="tooltip mt-4 mb-4">
        {tab === "signIn" && (
          <span className="description pt-2 pb-2 fl-l">
            롤링페이퍼를 새로 만들고 싶다면?!
          </span>
        )}
        {tab === "signUp" && (
          <span className="description pt-2 pb-2 fl-r">
            개인정보 없이 쉽고, 빠르게 가입하기!
          </span>
        )}
      </section>
      <div className="tab-wrapper mb-2">
        <button
          className={`tab ${tab === "signIn" ? "active" : ""}`}
          data-tab="signIn"
          onClick={handleTab}
        >
          로그인
        </button>
        <button
          className={`tab ${tab === "signUp" ? "active" : ""}`}
          data-tab="signUp"
          onClick={handleTab}
        >
          회원가입
        </button>
      </div>
      {tab === "signIn" && <SignIn />}
      {tab === "signUp" && <SignUp />}
    </>
  )
}

export default WithSignUp
