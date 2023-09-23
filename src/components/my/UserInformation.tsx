"use client"

import {useState, useLayoutEffect, type ReactNode} from "react"
import Image from "next/image"
import Storage from "@/store/local-storage"

export type TProps = {
  right: ReactNode
}

const UserInformation = ({right}: TProps) => {
  const [profile, setProfile] = useState("")
  const [nickName, setNickName] = useState("")

  useLayoutEffect(() => {
    setProfile(Storage.get("profile") || "")
    setNickName(Storage.get("nickName") || "")
  }, [])

  return (
    <div className="user-information">
      <Image
        src={profile}
        alt="프로필 이미지"
        loading="eager"
        width={108}
        height={108}
      />
      <div className="nick-name">
        <h2>반가워요!</h2>
        <h2 suppressHydrationWarning>{nickName}님!</h2>
        {right}
      </div>
    </div>
  )
}

export default UserInformation
