"use client"

import {useState, useEffect, useContext, type ChangeEvent} from "react"
import Image from "next/image"
import {useRouter, useSearchParams} from "next/navigation"
import ReactCrop from "react-image-crop"
import {Loading, BottomSheet} from "@/components"
import {ProfileStore} from "./Context"
import useRequest from "@/hooks/use-request"
import useImageCrop from "@/hooks/use-image-crop"
import {OPEN, PROFILE_EDIT, ROUTE} from "@/constants/service"

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

  const {profile, setProfile} = useContext(ProfileStore)

  const {request} = useRequest()
  const router = useRouter()
  const searchParams = useSearchParams()

  const aspect = 1
  const {
    image,
    imageRef,
    crop,
    cropRef,
    setCrop,
    setCompletedCrop,
    convertBlobToDataUrl,
    initializeAspect,
    makeCropAsBlobImage,
    revokeBlob,
    revokeImage,
  } = useImageCrop(aspect)

  const isOpenSearchParams = searchParams.get(OPEN) === PROFILE_EDIT

  useEffect(() => {
    if (!!image) {
      openBottomSheet()
    } else {
      closeBottomSheet()
    }
    setDefaultProfiles(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsBottomSheetOpen(isOpenSearchParams)
  }, [isOpenSearchParams])

  function uploadProfile(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files?.length) {
      return
    }

    openBottomSheet()
    convertBlobToDataUrl(event.target.files[0])
  }

  async function makeCropAsProfile() {
    const profileUrl = await makeCropAsBlobImage()
    setProfile(profileUrl)
    closeBottomSheet()
  }

  function selectProfile(index: number) {
    revokeBlob()
    setProfile(defaultProfiles[index])
  }

  function openBottomSheet() {
    router.push(ROUTE.MY_SETTING_PROFILE)
  }

  function closeBottomSheet() {
    revokeImage()
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
        <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
          {!!image && (
            <>
              <h2 className="mb-2">사진 편집하기</h2>
              <ReactCrop
                ref={cropRef}
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
                aspect={aspect}
                minHeight={68}
                minWidth={68}
                circularCrop
              >
                <img
                  ref={imageRef}
                  src={image}
                  alt="편집할 프로필 이미지"
                  onLoad={initializeAspect}
                />
              </ReactCrop>
              <button
                className="confirm sm mt-4 radius-md"
                onClick={makeCropAsProfile}
              >
                사진 가져오기
              </button>
            </>
          )}
        </BottomSheet>
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
