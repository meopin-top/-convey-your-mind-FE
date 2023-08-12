"use client"

import {useEffect, type ReactNode, type HTMLAttributes} from "react"

type TProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  isHandlingHistory?: boolean
} & HTMLAttributes<HTMLDivElement>

const BottomSheet = ({
  children,
  isOpen,
  onClose,
  isHandlingHistory = true,
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

  return (
    <article
      id="bottom-sheet"
      className={`${isOpen ? "open" : "close"} background`}
      onClick={onClose}
    >
      <div className="wrapper" {...props}>
        {children}
      </div>
    </article>
  )
}

export default BottomSheet
