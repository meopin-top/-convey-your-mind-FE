"use client"

import {useEffect, useState} from "react"
import dynamic from "next/dynamic"
import {TextContent, ImageContent} from "./"
import useRollingPaperSocket from "@/hooks/use-rolling-paper-socket"
import useRequest from "@/hooks/use-request"
import useWheelScroll from "@/hooks/use-wheel-scroll"
import useCanvas from "@/hooks/use-canvas"
import {
  TextPreviewItem,
  ImagePreviewItem,
  TextItem,
  ImageItem,
} from "@/helpers/canvas"
import Store from "@/store/rolling-paper"
import Storage from "@/store/local-storage"
import type {
  TRollingPaperImageContent,
  TRollingPaperTextContent,
  TRollingPaperContentSize,
  TContentType,
} from "@/@types/rolling-paper"

const Portal = dynamic(() => import("../../Portal"), {
  loading: () => <></>,
})
const FlowAlert = dynamic(() => import("../../FlowAlert"), {
  loading: () => <></>,
})

type TProps = {
  projectId: string
  toWhom: string
  type: string
}

const Canvas = ({projectId, toWhom, type}: TProps) => {
  const [tooltip, setTooltip] = useState<{
    isOpen: boolean
    pageY: number
    pageX: number
    type: TContentType
  }>({
    isOpen: false,
    pageY: 0,
    pageX: 0,
    type: "",
  })
  const [isTextBottomSheetOpen, setIsTextBottomSheetOpen] = useState(false) // 쿼리스트링을 이용하여 바텀 시트 open/close를 조절하면, 바텀 시트 open 시 자동으로 scrollY가 0이 됨
  const [isImageBottomSheetOpen, setIsImageBottomSheetOpen] = useState(false)
  const [isUnsavedContentAlerting, setIsUnsavedContentAlerting] =
    useState(false)

  const {request} = useRequest()

  const {handleMouseDown, handleMouseMove, handleMouseUp} = useWheelScroll()

  const {
    contentPreview,
    createContent,
    removeContent,
    isConfirmAlerting,
    closeConfirmAlerting,
    isRemovalAlerting,
    closeRemovalAlerting,
  } = useCanvas()

  const {send, isContentSendingError, closeContentSendingError} =
    useRollingPaperSocket(projectId, drawTextContent, drawImageContent)

  useEffect(() => {
    request({
      path: `/projects/${projectId}/enter`,
      method: "post",
    }) // json 파싱 시 에러 발생. 응답 body가 없어서 그런 것이므로 무시

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  function handleTooltip(event: {pageY: number; pageX: number}) {
    if (contentPreview) {
      setIsUnsavedContentAlerting(true)
      setTooltip({
        isOpen: false,
        pageY: event.pageY,
        pageX: event.pageX,
        type: tooltip.type,
      })

      return
    }

    setTooltip({
      isOpen: !tooltip.isOpen,
      pageY: event.pageY,
      pageX: event.pageX,
      type: tooltip.type,
    })
  }

  function closeTooltip(type: TContentType = tooltip.type) {
    setTooltip({
      isOpen: false,
      pageY: tooltip.pageY,
      pageX: tooltip.pageX,
      type,
    })
  }

  function closeBottomSheet() {
    setIsTextBottomSheetOpen(false)
    setIsImageBottomSheetOpen(false)
  }

  function openTextContentBottomSheet() {
    setIsTextBottomSheetOpen(true)
    closeTooltip("text")
  }

  function openImageContentBottomSheet() {
    setIsImageBottomSheetOpen(true)
    closeTooltip("image")
  }

  function drawTextContent(content: TRollingPaperTextContent) {
    createContent(
      new TextItem({
        content: {
          sender: content.sender,
          text: content.text,
        },
        position: {
          pageY: content.y,
          pageX: content.x,
        },
        size: {
          width: content.width,
          height: content.height,
        },
      })
    )
  }

  function drawTextPreviewContent(sender: string, text: string) {
    createContent(
      new TextPreviewItem({
        content: {
          sender,
          text,
        },
        position: {
          pageY: tooltip.pageY,
          pageX: tooltip.pageX,
        },
      })
    )
  }

  function drawImageContent(content: TRollingPaperImageContent) {
    createContent(
      new ImageItem({
        content: {
          image: content.image_url,
          sender: content.sender,
        },
        position: {
          pageY: content.y,
          pageX: content.x,
        },
        size: {
          width: content.width,
          height: content.height,
        },
      })
    )
  }

  function drawImagePreviewContent(
    sender: string,
    imageUrl: string,
    size: TRollingPaperContentSize
  ) {
    createContent(
      new ImagePreviewItem({
        content: {
          sender,
          image: imageUrl,
        },
        position: {
          pageY: tooltip.pageY,
          pageX: tooltip.pageX,
        },
        size,
      })
    )
  }

  function removeUnsavedContent() {
    removeContent()
    setTooltip({
      ...tooltip,
      isOpen: true,
    })
    closeIsUnsavedContentAlerting()
  }

  function closeIsUnsavedContentAlerting() {
    setIsUnsavedContentAlerting(false)
  }

  function sendContent() {
    if (!contentPreview) {
      return
    }

    if (tooltip.type === "text") {
      sendTextContent()
    } else if (tooltip.type === "image") {
      sendImageContent()
    } else {
      console.error("invalid send content type")
    }
  }

  function sendTextContent() {
    const separator = "\nV\nX\n"
    const [text, sender] = contentPreview!.innerText.split(separator)

    send({
      user_id:
        Storage.get("nickName") ?? (Storage.get("fingerprint") as string),
      content_type: "text",
      x: contentPreview!.getBoundingClientRect().x,
      y: contentPreview!.getBoundingClientRect().y,
      width: contentPreview!.getBoundingClientRect().width,
      height: contentPreview!.getBoundingClientRect().height,
      text,
      sender,
    })
    closeConfirmAlerting()
    removeContent()
  }

  function sendImageContent() {
    const separator = "V\nX\n"
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, sender] = contentPreview!.innerText.split(separator)
    const image = contentPreview!.style.backgroundImage.slice(
      5,
      contentPreview!.style.backgroundImage.length - 2
    )

    send({
      user_id:
        Storage.get("nickName") ?? (Storage.get("fingerprint") as string),
      content_type: "image",
      x: contentPreview!.getBoundingClientRect().x,
      y: contentPreview!.getBoundingClientRect().y,
      width: contentPreview!.getBoundingClientRect().width,
      height: contentPreview!.getBoundingClientRect().height,
      image_url: image,
      sender,
    })
    closeConfirmAlerting()
    removeContent()
  }

  return (
    <>
      <Store.Provider value={{toWhom}}>
        <div
          className={`type-${type}`}
          onMouseDownCapture={handleMouseDown}
          onMouseMoveCapture={handleMouseMove}
          onMouseUpCapture={handleMouseUp}
          onClickCapture={handleTooltip}
        />
        <div
          className="whom f-center shadow-md pt-4 pr-4 pb-4 pl-4"
          onMouseDownCapture={handleMouseDown}
          onMouseMoveCapture={handleMouseMove}
          onMouseUpCapture={handleMouseUp}
          onClickCapture={() => closeTooltip()}
        >
          {toWhom}
        </div>
        {tooltip.isOpen && (
          // top: y - (툴팁 height + 화살표 border), left: x - (화살표 left + 화살표 border / 2)
          <div
            className="tooltip"
            style={{top: tooltip.pageY - 72, left: tooltip.pageX - 18}}
          >
            <button
              type="button"
              className="f-center md shadow-sm radius-md"
              onClick={openTextContentBottomSheet}
            >
              편지 쓰기
            </button>
            <button
              type="button"
              className="f-center md shadow-sm radius-md"
              onClick={openImageContentBottomSheet}
            >
              사진 넣기
            </button>
          </div>
        )}
        <TextContent
          isBottomSheetOpen={isTextBottomSheetOpen}
          onClose={closeBottomSheet}
          onComplete={drawTextPreviewContent}
        />
        <ImageContent
          isBottomSheetOpen={isImageBottomSheetOpen}
          onClose={closeBottomSheet}
          onComplete={drawImagePreviewContent}
        />
      </Store.Provider>

      <Portal
        render={() => (
          <>
            <FlowAlert
              isAlerting={isUnsavedContentAlerting}
              onClose={closeIsUnsavedContentAlerting}
              content={
                <>
                  편집 중인 컨텐츠는 저장되지 않습니다.
                  <br />
                  새로운 컨텐츠를 만드시겠습니까?
                </>
              }
              defaultButton="취소"
              additionalButton="확인"
              onClick={removeUnsavedContent}
            />
            <FlowAlert
              isAlerting={isConfirmAlerting}
              onClose={closeConfirmAlerting}
              content={
                <>
                  친구에게 보낼 메세지를 확정합니다.
                  <br />
                  메세지는 더이상 수정/삭제할 수 없어요!
                </>
              }
              defaultButton="취소"
              additionalButton="확인"
              onClick={sendContent}
            />
            <FlowAlert
              isAlerting={isRemovalAlerting}
              onClose={closeRemovalAlerting}
              content={<>해당 메시지를 삭제하시겠습니까?</>}
              defaultButton="취소"
              additionalButton="확인"
              onClick={removeContent}
            />
            <FlowAlert
              isAlerting={isContentSendingError}
              onClose={closeContentSendingError}
              content={<>메시지를 전송하는 데에 실패했습니다.</>}
            />
          </>
        )}
      />
    </>
  )
}

export default Canvas
