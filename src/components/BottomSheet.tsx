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
    if (isHandlingHistory) {
      window.addEventListener("popstate", onClose)

      return () => {
        window.removeEventListener("popstate", onClose)
      }
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
      <div className="wrapper" {...props} onClick={handlePropagation}>
        {isShowingClose && (
          <button className="close" onClick={onClose}>
            <Close className="md" />
          </button>
        )}
        {children}
      </div>
    </article>
  )
}

export default BottomSheet
