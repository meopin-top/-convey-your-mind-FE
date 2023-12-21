"use client"

import {useState, useEffect, useContext} from "react"
import Image from "next/image"
import {Loading} from "@/components"
import {ProfileStore} from "./Context"
import useRequest from "@/hooks/use-request"

// TODO: API 연동 후 삭제
const data: string[] = [
  "https://storage.googleapis.com/convey-your-mind-dev-bucket/profile/default.jpg",
  "https://storage.googleapis.com/convey-your-mind-dev-bucket/profile/default.jpg",
  "https://storage.googleapis.com/convey-your-mind-dev-bucket/profile/default.jpg",
  "https://storage.googleapis.com/convey-your-mind-dev-bucket/profile/default.jpg",
  "https://storage.googleapis.com/convey-your-mind-dev-bucket/profile/default.jpg",
  "https://storage.googleapis.com/convey-your-mind-dev-bucket/profile/default.jpg",
]

const Profile = () => {
  const [defaultProfiles, setDefaultProfiles] = useState<string[]>([])

  const {profile, setProfile} = useContext(ProfileStore)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {request} = useRequest()

  useEffect(() => {
    setDefaultProfiles(data)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selectProfile(index: number) {
    setProfile(defaultProfiles[index])
  }

  return (
    <div className="profile-wrapper input-wrapper mb-2">
      <span className="input-name mb-2">프로필 사진</span>
      <div className="selected f-center mr-4">
        {profile ? (
          <Image
            src={profile as string}
            className="profile"
            alt="프로필 이미지"
            loading="eager"
            width={68}
            height={68}
          />
        ) : (
          <Loading isLoading style={{width: "68px", height: "68px"}} />
        )}
        <button className="upload-profile xxs radius-md" onClick={() => {}}>
          내 사진 가져오기
        </button>
      </div>
      <div className="default-profiles">
        <span>리스트에서 선택하기</span>
        <div className="profiles-box mt-2">
          {defaultProfiles.map((defaultProfile, index) => (
            <Image
              key={index}
              src={defaultProfile}
              className={`${
                profile === defaultProfile ? "selected" : ""
              } profile`}
              alt="기본 프로필 이미지"
              loading="eager"
              width={32}
              height={32}
              onClick={() => selectProfile(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
