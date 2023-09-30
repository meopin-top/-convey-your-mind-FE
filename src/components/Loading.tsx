"use client"

import {useState, useEffect, type MouseEvent, type HTMLAttributes} from "react"
import {Close, Spinner} from "@/assets/icons"
import type {TIconSize} from "@/@types/style"

export type TProps = {
  isLoading: boolean
  blur?: boolean
  onClose?: (event: MouseEvent<HTMLOrSVGElement>) => void
  duration?: number
  size?: TIconSize
} & HTMLAttributes<HTMLDivElement>

const Loading = ({
  isLoading,
  blur = false,
  onClose,
  duration = 3000,
  size = "md",
  ...props
}: TProps) => {
  const [isShowingClose, setIsShowingClose] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowingClose(true)
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [duration])

  return (
    <>
      {isLoading && (
        <div className={`loading f-center ${blur ? "blur" : ""}`} {...props}>
          <Spinner className={size} role="status" />
          {onClose && (
            <button
              className={`close ${isShowingClose ? "show" : "hide"}`}
              onClick={onClose}
            >
              {isShowingClose && <Close className="md" />}
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default Loading
