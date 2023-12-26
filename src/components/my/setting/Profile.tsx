"use client"

import {
  useState,
  useEffect,
  useContext,
  type ChangeEvent,
  type SyntheticEvent,
} from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import {useRouter, useSearchParams} from "next/navigation"
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop"
import {Loading} from "@/components"
import {ProfileStore} from "./Context"
import useRequest from "@/hooks/use-request"
import {OPEN, PROFILE_EDIT, ROUTE} from "@/constants/service"
import "react-image-crop/dist/ReactCrop.css"

const BottomSheet = dynamic(() => import("../../BottomSheet"), {
  loading: () => <></>,
})

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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [image, setImage] = useState<string>("")
  const [crop, setCrop] = useState<Crop>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const {profile, setProfile} = useContext(ProfileStore)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {request} = useRequest()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isOpenSearchParams = searchParams.get(OPEN) === PROFILE_EDIT
  const aspect = 1

  useEffect(() => {
    if (isOpenSearchParams) {
      if (!!image) {
        openBottomSheet()
      } else {
        closeBottomSheet()
      }
    }
    setDefaultProfiles(data)

    return () => {
      if (image) {
        URL.revokeObjectURL(image)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsBottomSheetOpen(isOpenSearchParams)
  }, [isOpenSearchParams])

  function uploadProfile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target?.files?.length) {
      openBottomSheet()

      const reader = new FileReader()
      reader.addEventListener("load", () =>
        setImage(reader.result?.toString() || "")
      )
      reader.readAsDataURL(event.target.files[0])
    }
  }

  function initializeAspect(event: SyntheticEvent<HTMLImageElement>) {
    const {width, height} = event.currentTarget

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
          height: 100,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    )
    setCrop(initialCrop)
  }

  function selectProfile(index: number) {
    setProfile(defaultProfiles[index])
  }

  function openBottomSheet() {
    router.push(ROUTE.MY_SETTING_PROFILE)
  }

  function closeBottomSheet() {
    router.push(ROUTE.MY_SETTING)
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
        <button
          className={`upload-profile ${
            isBottomSheetOpen ? "uploading" : ""
          } xxs radius-md`}
        >
          {isBottomSheetOpen ? (
            <Loading isLoading style={{width: "100%", height: "100%"}} />
          ) : (
            <>
              <label htmlFor="profile-uploader" className="f-center">
                내 사진 가져오기
              </label>
              <input
                type="file"
                accept="image/*"
                id="profile-uploader"
                onChange={uploadProfile}
              />
            </>
          )}
        </button>
        {image && (
          <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
            <h5>사진 편집하기</h5>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={setCompletedCrop}
              aspect={aspect}
              minHeight={68}
              minWidth={68}
              circularCrop
            >
              <img src={image} alt="" onLoad={initializeAspect} />
            </ReactCrop>
            <button className="confirm lg radius-md">사진 가져오기</button>
          </BottomSheet>
        )}
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
