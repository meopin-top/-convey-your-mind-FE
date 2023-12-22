"use client"

import {useContext} from "react"
import {NicknameStore} from "./Context"
import useRequest from "@/hooks/use-request"
import {ArrowCycle} from "@/assets/icons"
import {AUTH} from "@/constants/response-code"

const Nickname = () => {
  const {nickname, handleNickname, setNickname} = useContext(NicknameStore)

  const {request, isLoading} = useRequest()

  async function regenerator() {
    if (isLoading) {
      return
    }

    const {code, data} = await request({
      method: "get",
      path: "/users/nickname/random",
    })

    if (code === AUTH.USER.GET_RANDOM_NICKNAME_SUCCESS) {
      setNickname(data)
    }
  }

  return (
    <div className="input-wrapper f-center mb-2">
      <span className="input-name">닉네임</span>
      <input
        type="text"
        className="input radius-sm mr-4"
        minLength={2}
        maxLength={30}
        required
        value={isLoading ? "..." : nickname}
        onChange={handleNickname}
        disabled={isLoading}
      />
      <ArrowCycle className="nickname-regenerator md" onClick={regenerator} />
    </div>
  )
}

export default Nickname
