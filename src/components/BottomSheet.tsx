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
} & HTMLAttributes<HTMLDivElement>

const BottomSheet = ({
  children,
  isOpen,
  onClose,
  isHandlingHistory = true,
  isShowingClose = true,
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
