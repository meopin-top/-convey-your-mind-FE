"use client"

import {
  useEffect,
  type ReactNode,
  type HTMLAttributes,
  type MouseEvent,
} from "react"
import {Close} from "@/assets/icons"

type TProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  isHandlingHistory?: boolean
  isShowingClose?: boolean
  isControllingScroll?: boolean
} & HTMLAttributes<HTMLDivElement>

const BottomSheet = ({
  children,
  isOpen,
  onClose,
  isHandlingHistory = true,
  isShowingClose = true,
  isControllingScroll = true,
  ...props
}: TProps) => {
  useEffect(() => {
    if (!isHandlingHistory) {
      return
    }

    window.addEventListener("popstate", onClose)

    return () => {
      window.removeEventListener("popstate", onClose)
    }
  }, [isHandlingHistory, onClose])

  useEffect(() => {
    if (!isControllingScroll) {
      return
    }

    let scrollPosition = 0
    const lockScroll = () => {
      // for IOS safari
      scrollPosition = window.pageYOffset
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollPosition}px`
      document.body.style.width = "100%"
    }

    const openScroll = () => {
      // for IOS safari
      document.body.style.removeProperty("overflow")
      document.body.style.removeProperty("position")
      document.body.style.removeProperty("top")
      document.body.style.removeProperty("width")
      window.scrollTo(0, scrollPosition)
    }

    if (isOpen) {
      lockScroll()
    } else {
      openScroll()
    }
  }, [isControllingScroll, isOpen])

  function handlePropagation(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  return (
    <article
      id="bottom-sheet"
      className={`${isOpen ? "open" : "close"} background`}
      onClick={onClose}
    >
      <div className="wrapper" onClick={handlePropagation} {...props}>
        {isShowingClose && (
          <div className="close">
            <button onClick={onClose} className="fl-r">
              <Close className="sm" />
            </button>
          </div>
        )}
        <div className="content">{children}</div>
      </div>
    </article>
  )
}

export default BottomSheet
