"use client"

import {
  useEffect,
  type ReactNode,
  type HTMLAttributes,
  type MouseEvent,
} from "react"
import {Close} from "@/assets/icons"
import useBodyScrollLock from "@/hooks/use-body-scroll-lock"

type TProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  isShowingClose?: boolean
  isControllingScroll?: boolean
} & HTMLAttributes<HTMLDivElement>

const BottomSheet = ({
  children,
  isOpen,
  onClose,
  isShowingClose = true,
  isControllingScroll = true,
  ...props
}: TProps) => {
  const {lockScroll, unlockScroll} = useBodyScrollLock()

  useEffect(() => {
    if (!isControllingScroll) {
      return
    }

    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }, [isControllingScroll, isOpen, lockScroll, unlockScroll])

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
