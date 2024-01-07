"use client"

import {
  useState,
  useEffect,
  useContext,
  useRef,
  type ChangeEvent,
  type SyntheticEvent,
} from "react"
import Image from "next/image"
import {useRouter, useSearchParams} from "next/navigation"
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop"
import {Loading, BottomSheet} from "@/components"
import {ProfileStore} from "./Context"
import useRequest from "@/hooks/use-request"
import {OPEN, PROFILE_EDIT, ROUTE} from "@/constants/service"
import "react-image-crop/dist/ReactCrop.css"

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
  const [image, setImage] = useState("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const {profile, setProfile} = useContext(ProfileStore)

  const imageRef = useRef<HTMLImageElement>(null)
  const cropRef = useRef<ReactCrop>(null)
  const blobRef = useRef("")

  const {request} = useRequest()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isOpenSearchParams = searchParams.get(OPEN) === PROFILE_EDIT
  const aspect = 1

  useEffect(() => {
    if (!!image) {
      openBottomSheet()
    } else {
      closeBottomSheet()
    }
    setDefaultProfiles(data)

    return () => {
      revokeBlob()
      revokeImage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsBottomSheetOpen(isOpenSearchParams)
  }, [isOpenSearchParams])

  useEffect(() => {
    if (cropRef.current) {
      const cropMask = cropRef.current.componentRef.current?.querySelector(
        ".ReactCrop__crop-mask"
      )

      const realImageHeight =
        cropRef.current.componentRef.current?.getBoundingClientRect().height

      if (realImageHeight) {
        cropMask?.setAttribute("height", realImageHeight.toString())
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageRef.current])

  function uploadProfile(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files?.length) {
      return
    }

    openBottomSheet()

    const reader = new FileReader()
    reader.addEventListener("load", () =>
      setImage(reader.result?.toString() || "")
    )
    reader.readAsDataURL(event.target.files[0])
  }

  function initializeAspect(event: SyntheticEvent<HTMLImageElement>) {
    const {width, height} = event.currentTarget

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "px",
          width,
          height,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    )
    setCrop(initialCrop)
    setCompletedCrop(initialCrop)
  }

  async function makeCropAsBlobImage() {
    if (!completedCrop || !imageRef.current) {
      throw new Error("completed crop 없음")
    }

    const offscreen = new OffscreenCanvas(
      completedCrop.width,
      completedCrop.height
    )
    const ctx = offscreen.getContext("2d")
    if (!ctx) {
      throw new Error("canvas 2d 없음")
    }

    const scaleX = imageRef.current.naturalWidth / imageRef.current.width
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height
    const targetSize = 216

    offscreen.width = targetSize
    offscreen.height = targetSize

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetSize,
      targetSize
    )

    console.warn(completedCrop)

    const blob = await offscreen.convertToBlob({
      type: "image/webp",
    })

    revokeBlob()
    const profileUrl = URL.createObjectURL(blob)
    setProfile(profileUrl)
    blobRef.current = profileUrl

    closeBottomSheet()
  }

  function revokeBlob() {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current)
    }
  }

  function revokeImage() {
    if (image) {
      URL.revokeObjectURL(image)
    }
    setImage("")
  }

  function selectProfile(index: number) {
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
                onClick={makeCropAsBlobImage}
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
