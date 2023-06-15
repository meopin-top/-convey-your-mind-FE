"use client"

import {useState, type ChangeEvent} from "react"
import {post} from "@/api"

const Home = () => {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  function handleId(event: ChangeEvent<HTMLInputElement>) {
    setId(event.target.value)
  }

  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  async function signup() {
    const {message} = await post("/users/sign-up", {
      userId: id,
      nickName: id,
      password,
      passwordCheck: password,
    })

    alert(message)
  }

  async function login() {
    const {message} = await post("/users/sign-in", {
      userId: id,
      password,
    })

    alert(message)
  }

  return (
    <div>
      <div>회원가입, 로그인 겸용</div>
      <input
        type="text"
        placeholder="아이디"
        style={{width: "400px", padding: "0 4px", marginRight: "4px"}}
        value={id}
        onChange={handleId}
      />
      <input
        type="text"
        placeholder="비밀번호"
        style={{width: "400px", padding: "0 4px"}}
        value={password}
        onChange={handlePassword}
      />

      <br />

      <span>여기는 회원가입 버튼입니다. 개발자 도구를 확인해주세요</span>
      <button className="lg" onClick={signup}>
        회원가입 버튼
      </button>

      <br />

      <span>여기는 로그인 버튼입니다. 개발자 도구를 확인해주세요</span>
      <button className="lg" onClick={login}>
        로그인 버튼
      </button>
    </div>
  )
}

export default Home
