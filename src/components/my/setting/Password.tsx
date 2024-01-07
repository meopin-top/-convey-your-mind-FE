"use client"

import {useContext} from "react"
import {PasswordStore} from "./Context"
import SecretInput from "@/components/SecretInput"
import {VALIDATOR} from "@/constants/input"

const Password = () => {
  const {password, handlePassword, passwordConfirm, handlePasswordConfirm} =
    useContext(PasswordStore)

  return (
    <>
      <div className="input-wrapper f-center">
        <span className="input-name mb-2">PW 변경</span>
        <SecretInput
          className="input radius-sm mb-2"
          placeholder="비밀번호를 입력해주세요."
          minLength={8}
          maxLength={20}
          required
          value={password}
          onChange={handlePassword}
        />
      </div>
      <section className="validity mb-2">
        <div
          className={`${
            VALIDATOR.ENGLISH.test(password) ? "valid" : "invalid"
          }-light`}
          role="status"
        />
        <span>영문</span>
        <div
          className={`${
            VALIDATOR.NUMBER.test(password) ? "valid" : "invalid"
          }-light`}
          role="status"
        />
        <span>숫자</span>
        <div
          className={`${
            VALIDATOR.SPECIAL_CHARACTER.test(password) ? "valid" : "invalid"
          }-light`}
          role="status"
        />
        <span>특수 문자</span>
        <div
          className={`${password.length >= 8 ? "valid" : "invalid"}-light`}
          role="status"
        />
        <span>8글자 이상</span>
      </section>

      <div className="input-wrapper f-center">
        <span className="input-name mb-2">PW 재입력</span>
        <SecretInput
          className="input radius-sm mb-2"
          placeholder="비밀번호를 입력해주세요."
          minLength={8}
          maxLength={20}
          required
          value={passwordConfirm}
          onChange={handlePasswordConfirm}
        />
      </div>
      <section className="validity mb-2">
        <div
          className={`${
            password === passwordConfirm ? "valid" : "invalid"
          }-light`}
          role="status"
        />
        <span>일치</span>
      </section>
    </>
  )
}

export default Password
