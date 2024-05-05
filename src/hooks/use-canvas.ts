import {useState, useEffect} from "react"
import type {TPosition, TRollingPaperContentSize} from "@/@types/rolling-paper"

type TCanvasComponent = HTMLDivElement | null

const INITIAL_POSITION = {
  pageX: 0,
  pageY: 0,
}

export default function useCanvas() {
  const [wrapper, setWrapper] = useState<TCanvasComponent>(null)
  const [contentPreview, setContentPreview] = useState<TCanvasComponent>(null)
  const [isConfirmAlerting, setIsConfirmAlerting] = useState(false)
  const [isRemovalAlerting, setIsRemovalAlerting] = useState(false)

  useEffect(() => {
    setWrapper(getWrapper())
  }, [])

  function getWrapper() {
    return document.querySelector(".root-wrapper") as HTMLDivElement
  }

  // TODO: content, isPreview에 따라 클래스 변경한 뒤 리팩토링 필요
  function createContent({
    content,
    position,
    size,
    isPreview = false,
  }: {
    content:
      | {sender: string; text: string; image?: null}
      | {sender: string; text?: null; image: string}
    position: TPosition
    size?: TRollingPaperContentSize
    isPreview?: boolean
  }) {
    let sizable = false
    let draggable = false
    let dragOffsetPosition: TPosition = INITIAL_POSITION

    let confirmation: HTMLButtonElement
    let close: HTMLButtonElement
    let resize: HTMLButtonElement
    if (isPreview) {
      confirmation = document.createElement("button")
      close = document.createElement("button")
      resize = document.createElement("button")
    }

    const sender = document.createElement("span")
    const contentPreview = document.createElement("div")

    setStyle()
    setInner()
    setEvent()
    show()
    positionSender(contentPreview, sender)
    setPreviewState()

    function setStyle() {
      if (isPreview) {
        confirmation.classList.add("confirmation")
        close.classList.add("close")
        resize.classList.add("size")
      }

      contentPreview.style.top = `${position.pageY}px`
      contentPreview.style.left = `${position.pageX}px`
      contentPreview.style.width = size
        ? `${size.width}px`
        : `${(visualViewport?.width ?? 100) / 4}px`
      contentPreview.style.height = size ? `${size.height}px` : "unset"
      contentPreview.classList.add("paper-content")
      contentPreview.classList.add("edit")
      if (content.text) {
        contentPreview.classList.add("pt-2")
        contentPreview.classList.add("pr-2")
        contentPreview.classList.add("pb-4")
        contentPreview.classList.add("pl-2")
      }

      sender.classList.add("sender")
      sender.classList.add("pt-1")
      sender.classList.add("pr-1")
      sender.classList.add("pb-1")
      sender.classList.add("pl-1")
    }

    function setInner() {
      if (isPreview) {
        confirmation.innerText = "V"
        close.innerText = "X"
      }

      if (content.text) {
        contentPreview.innerText = content.text
      }
      if (content.image) {
        // contentPreview 드래그 이벤트를 간단히 구현하기 위해 img 엘리먼트를 생성하지 않음
        contentPreview.style.backgroundImage = `url("${content.image}")`
      }
      ;(sender as HTMLSpanElement).innerText = content.sender
    }

    function setEvent() {
      // drag 이벤트를 쓸 필요가 없음: https://ko.javascript.info/mouse-drag-and-drop
      if (isPreview) {
        confirmation.addEventListener("click", () => {
          setIsConfirmAlerting(true)
        })
        close.addEventListener("click", () => {
          setIsRemovalAlerting(true)
        })
        resize.addEventListener("mousedown", ({target}) => {
          if (target === resize) {
            sizable = true
            dragOffsetPosition = {
              pageY: Number(
                contentPreview.style.top.slice(
                  0,
                  contentPreview.style.top.length - 2
                )
              ),
              pageX: Number(
                contentPreview.style.left.slice(
                  0,
                  contentPreview.style.left.length - 2
                )
              ),
            }
          }
        })
        document.addEventListener("mousemove", ({pageX, pageY}) => {
          if (sizable) {
            contentPreview.style.height = `${
              pageY - dragOffsetPosition.pageY
            }px`
            contentPreview.style.width = `${pageX - dragOffsetPosition.pageX}px`
            positionSender(contentPreview, sender)
          }
        })
        resize.addEventListener("mouseup", () => {
          if (sizable) {
            sizable = false
            dragOffsetPosition = INITIAL_POSITION
          }
        })

        contentPreview.addEventListener(
          "mousedown",
          ({target, offsetX, offsetY}) => {
            if (target === contentPreview) {
              draggable = true
              dragOffsetPosition = {
                pageY: offsetY,
                pageX: offsetX,
              }
            }
          }
        )
        document.addEventListener("mousemove", ({pageX, pageY}) => {
          if (draggable) {
            contentPreview.style.top = `${pageY - dragOffsetPosition.pageY}px`
            contentPreview.style.left = `${pageX - dragOffsetPosition.pageX}px`
          }
        })
        contentPreview.addEventListener("mouseup", () => {
          if (draggable) {
            draggable = false
            dragOffsetPosition = INITIAL_POSITION
          }
        })
      }
    }

    function show() {
      if (isPreview) {
        contentPreview.appendChild(confirmation)
        contentPreview.appendChild(close)
        contentPreview.appendChild(resize)
      }

      contentPreview.appendChild(sender as HTMLSpanElement)
      ;(wrapper || getWrapper()).appendChild(contentPreview)
    }

    function setPreviewState() {
      if (isPreview) {
        setContentPreview(contentPreview)
      }
    }
  }

  function positionSender(
    contentPreview: HTMLDivElement,
    sender: HTMLSpanElement
  ) {
    sender.style.left = `${
      contentPreview.getBoundingClientRect().width / 2 -
      sender.getBoundingClientRect().width / 2
    }px`
  }

  function removeContent() {
    if (!wrapper || !contentPreview) {
      return
    }

    wrapper.removeChild(contentPreview)
    setContentPreview(null)
    closeRemovalAlerting()
  }

  function closeConfirmAlerting() {
    setIsConfirmAlerting(false)
  }

  function closeRemovalAlerting() {
    setIsRemovalAlerting(false)
  }

  return {
    isConfirmAlerting,
    closeConfirmAlerting,
    isRemovalAlerting,
    closeRemovalAlerting,
    contentPreview,
    createContent,
    removeContent,
  }
}
