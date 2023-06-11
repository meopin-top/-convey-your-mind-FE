"use client"

import {useState, useEffect, type MouseEvent, type HTMLAttributes} from "react"
import {Close, Spinner} from "@/assets/icons"

export type TProps = {
  isLoading: boolean
  blur?: boolean
  onClose?: (event: MouseEvent<HTMLOrSVGElement>) => void
  duration?: number
  size?: string
} & HTMLAttributes<HTMLDivElement>

const Loading = ({
  isLoading,
  blur = false,
  onClose,
  duration = 3000,
  size = "md",
  ...props
}: TProps) => {
  const [showClose, setShowClose] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowClose(true)
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
              className={`close ${showClose ? "show" : "hide"}`}
              onClick={onClose}
            >
              {showClose && <Close className="md" />}
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default Loading
