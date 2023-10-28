"use client"

import {useRef, type ReactNode, type HTMLAttributes} from "react"

type TProps = {
  isOpen: boolean
  children: ReactNode
  duration?: number
} & HTMLAttributes<HTMLDivElement>

const Toast = ({isOpen, children, duration = 3, ...props}: TProps) => {
  const divElement = useRef<HTMLDivElement | null>(null)

  function keepFadeOutStatus() {
    if (divElement.current) {
      divElement.current.style.opacity = "0"
    }
  }

  return (
    <>
      {isOpen && (
        <div
          id="toast"
          className={`f-center radius-xl out-in-${duration}-sec`}
          onAnimationEnd={keepFadeOutStatus}
          ref={divElement}
          {...props}
        >
          {children}
        </div>
      )}
    </>
  )
}

export default Toast
