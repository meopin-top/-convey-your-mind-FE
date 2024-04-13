"use client"

import {useState, useEffect} from "react"
import type {
  TRollingPaperTextContent,
  TRollingPaperImageContent,
  TRollingPaperContent,
  TRollingPaperContents,
} from "@/@types/rolling-paper"

type TContent = {
  [id: string]: TRollingPaperContent
}

export default function useRollingPaperSocket(
  projectId: string,
  onReceiveTextMessage: (content: TRollingPaperTextContent) => void,
  onReceiveImageMessage: (content: TRollingPaperImageContent) => void
) {
  const [content, setContent] = useState<TContent>({})
  const [isContentSendingError, setIsContentSendingError] = useState(false)

  let socket = createSocket()

  useEffect(() => {
    initializeSocket()

    return () => {
      socket.close()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createSocket() {
    return new WebSocket(`${process.env.NEXT_PUBLIC_WSS_HOST}/${projectId}`)
  }

  function initializeSocket() {
    const messageCallback = ({data}: {data: string}) => {
      if (!data) {
        return
      }

      const rollingPaperContents: TRollingPaperContents | TRollingPaperContent =
        JSON.parse(data)

      if (Array.isArray(rollingPaperContents)) {
        // 처음 페이지 접근 시, 그 전에 작성된 메시지들
        setContent(
          (rollingPaperContents as TRollingPaperContent[]).reduce(
            (contents: TContent, aContent: TRollingPaperContent) => ({
              ...contents,
              [aContent.content_id]: aContent,
            }),
            {}
          )
        )
        ;(rollingPaperContents as TRollingPaperContent[])
          .filter(isTextContent)
          .map(onReceiveTextMessage)
        ;(rollingPaperContents as TRollingPaperContent[])
          .filter(isImageContent)
          .map(onReceiveImageMessage)
      } else {
        // 처음 페이지 접근 후, 실시간으로 작성된 메시지
        setContent({
          ...content,
          [rollingPaperContents.content_id]: rollingPaperContents,
        })

        if (isTextContent(rollingPaperContents)) {
          onReceiveTextMessage(rollingPaperContents)
        } else if (isImageContent(rollingPaperContents)) {
          onReceiveImageMessage(rollingPaperContents)
        }
      }
    }
    const errorCallback = () => {
      setIsContentSendingError(true)
    }
    const closeCallback = () => {
      initializeSocket()
    }

    if (socket.readyState !== socket.OPEN) {
      socket = createSocket()
    }

    socket.removeEventListener("message", messageCallback)
    socket.removeEventListener("error", errorCallback)
    socket.removeEventListener("close", closeCallback)

    socket.addEventListener("message", messageCallback)
    socket.addEventListener("error", errorCallback)
    socket.addEventListener("close", closeCallback)
  }

  function isTextContent(
    rollingPaperContent: TRollingPaperContent
  ): rollingPaperContent is TRollingPaperTextContent {
    return rollingPaperContent.content_type === "text"
  }

  function isImageContent(
    rollingPaperContent: TRollingPaperContent
  ): rollingPaperContent is TRollingPaperImageContent {
    return rollingPaperContent.content_type === "image"
  }

  function send(
    data:
      | Omit<TRollingPaperImageContent, "content_id">
      | Omit<TRollingPaperTextContent, "content_id">
  ) {
    if (socket.readyState !== socket.OPEN) {
      // socket status: https://github.com/websockets/ws/blob/HEAD/doc/ws.md#ready-state-constants
      initializeSocket()
    }

    const contentId = createRandomId()
    const newContent = {
      ...data,
      content_id: contentId,
    }

    socket.send(JSON.stringify(newContent))
  }

  function createRandomId() {
    let contentId = ""
    let isNewContentId = false

    while (!isNewContentId) {
      contentId = crypto.randomUUID()
      if (!content[contentId]) {
        isNewContentId = true
      }
    }

    return contentId
  }

  function closeContentSendingError() {
    setIsContentSendingError(false)
  }

  return {
    socket,
    content,
    send,
    isContentSendingError,
    closeContentSendingError,
  }
}
