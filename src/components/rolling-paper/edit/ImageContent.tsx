"use client"

import {useState, useEffect, type ChangeEvent} from "react"
import dynamic from "next/dynamic"
import ReactCrop from "react-image-crop"
import Content from "./Content"
import useInput from "@/hooks/use-input"
import useImageCrop from "@/hooks/use-image-crop"
import useRequest from "@/hooks/use-request"
import Storage from "@/store/local-storage"
import {IMAGE_CONTENT} from "@/constants/service"
import BottomSheet from "@/components/BottomSheet"
import {IMAGE_UPLOAD} from "@/constants/response-code"
import type {TRollingPaperContentSize} from "@/@types/rolling-paper"

const Loading = dynamic(() => import("../../Loading"), {
  loading: () => <></>,
})
const Portal = dynamic(() => import("../../Portal"), {
  loading: () => <></>,
})
const ErrorAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

type TProps = {
  isBottomSheetOpen: boolean
  onClose: () => void
  onComplete: (
    sender: string,
    imageUrl: string,
    size: TRollingPaperContentSize
  ) => void
}

const ImageContent = ({isBottomSheetOpen, onClose, onComplete}: TProps) => {
  const [isSenderDisabled, setIsSenderDisabled] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [step, setStep] = useState<"select" | "edit">("select")
  const [isSubmittedToServer, setIsSubmittedToServer] = useState(false)
  const [isError, setIsError] = useState(false)

  const [sender, handleSender, setSender] = useInput()

  const {request, isLoading, error, resetError} = useRequest()

  const {
    image,
    imageRef,
    crop,
    cropRef,
    completedCrop,
    setCrop,
    setCompletedCrop,
    convertBlobToDataUrl,
    initializeAspect,
    makeCropAsBlobImage,
    revokeBlob,
    revokeImage,
  } = useImageCrop(1)

  const isNotFinished = !image || (!isSenderDisabled && sender.length === 0)

  useEffect(() => {
    setSender(Storage.get("nickName") ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleIsSenderDisabled() {
    setIsSenderDisabled(!isSenderDisabled)
  }

  function goBack() {
    setStep("select")
    revokeImage()
  }

  async function makeCropAsImageContent() {
    const {url, blob} = await makeCropAsBlobImage()

    setImageUrl(url)
    setStep("select")

    if (process.env.NODE_ENV === "development") {
      setIsSubmittedToServer(true)
    } else {
      submitImage(blob)
    }
  }

  async function submitImage(blob: Blob) {
    const form = new FormData()
    form.append("image", blob)

    const {code, data} = await request({
      path: "/files",
      method: "post",
      body: form,
    })

    if (code === IMAGE_UPLOAD.SUCCESS) {
      setIsSubmittedToServer(true)
      setImageUrl(data)
    } else {
      setIsError(true)
    }
  }

  function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files?.length) {
      return
    }

    convertBlobToDataUrl(event.target.files[0])
    setStep("edit")
  }

  function finishInput() {
    onComplete(isSenderDisabled ? "익명" : sender, imageUrl, {
      width: completedCrop!.width,
      height: completedCrop!.height,
    })
    closeBottomSheet()
  }

  function closeBottomSheet() {
    resetState()
    onClose()
  }

  function resetState() {
    setIsSenderDisabled(false)
    setSender("")
    setImageUrl("")
    setStep("select")
    revokeBlob()
    revokeImage()
  }

  function closeErrorAlert() {
    closeBottomSheet()
    setIsError(false)
    resetError()
  }

  return (
    <>
      {step === "select" && (
        <Content
          isBottomSheetOpen={isBottomSheetOpen}
          type={IMAGE_CONTENT}
          isSenderDisabled={isSenderDisabled}
          handleIsSenderDisabled={handleIsSenderDisabled}
          sender={sender}
          handleSender={handleSender}
          onClose={closeBottomSheet}
        >
          <div className={`f-center ${imageUrl ? "image-selected" : ""}`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="mb-2"
                width={completedCrop?.width}
                height={completedCrop?.height}
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="image-content"
                  hidden
                  onChange={uploadImage}
                />
                <label
                  className="image f-center radius-sm mb-2"
                  htmlFor="image-content"
                >
                  + 사진 선택하기
                </label>
              </>
            )}
            <span className="information mb-4">
              롤링페이퍼에서 메세지의 크기와 위치를 확인/조정하신 후
              <br />
              <u>
                <b>{'"확정"을 클릭해야 작성이 완료'}</b>
              </u>
              됩니다!
            </span>
            <button
              className="confirm mb-2 radius-lg shadow-md"
              disabled={isNotFinished || !isSubmittedToServer}
              onClick={finishInput}
            >
              {isLoading ? "..." : "사진 추가하기"}
            </button>
          </div>
        </Content>
      )}
      {step === "edit" && (
        <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
          <button
            type="button"
            className="image-edit-goback pl-1"
            onClick={goBack}
          >
            {"< 이전"}
          </button>
          <h2 className="image-edit-title mb-2">사진 편집하기</h2>
          {image ? (
            <ReactCrop
              ref={cropRef}
              crop={crop}
              onChange={setCrop}
              onComplete={setCompletedCrop}
              minHeight={68}
              minWidth={68}
            >
              <img
                ref={imageRef}
                src={image}
                alt="편집할 컨텐츠 이미지"
                onLoad={initializeAspect}
              />
            </ReactCrop>
          ) : (
            <Loading isLoading style={{width: "100%", height: "100%"}} />
          )}
          <button
            className="confirm mt-4 mb-2 radius-md"
            onClick={makeCropAsImageContent}
          >
            삽입하기
          </button>
        </BottomSheet>
      )}
      <Portal
        render={() => (
          <ErrorAlert
            isAlerting={isError || !!error}
            onClose={closeErrorAlert}
            content={
              <>
                사진 업로드에 실패했습니다.
                <br />
                잠시 후 재시도해주세요.
              </>
            }
          />
        )}
      />
    </>
  )
}

export default ImageContent
