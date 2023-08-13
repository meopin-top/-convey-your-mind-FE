"use client"

import {useState, useLayoutEffect} from "react"
import Image from "next/image"
import Link from "next/link"
import Storage from "@/store/local-storage"

const UserInformation = () => {
  const [profile, setProfile] = useState("")
  const [nickName, setNickName] = useState("")

  useLayoutEffect(() => {
    setProfile(Storage.get("profile") || "")
    setNickName(Storage.get("nickName") || "")
  }, [])

  return (
    <div className="user-information">
      <div className="profile">
        <Image src={profile} alt="프로필 이미지" fill loading="eager" />
      </div>
      <div className="nick-name">
        <h1>반가워요!</h1>
        <h1 suppressHydrationWarning>{nickName}님!</h1>
        <button className="profile-edit xxxs radius-sm mt-2">
          <Link href={"#"}>프로필 편집</Link>
        </button>
      </div>
    </div>
  )
}

export default UserInformation
