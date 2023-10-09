"use client"

import {
  useState,
  forwardRef,
  type InputHTMLAttributes,
  type MutableRefObject,
} from "react"
import {EyeClose, EyeOpen} from "@/assets/icons"
import type {TIconSize} from "@/@types/style"

export type TProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  ref?: MutableRefObject<HTMLInputElement | null>
  size?: TIconSize
}

const SecretInput = ({className, ref, size = "md", ...props}: TProps) => {
  const [isShowing, setIsShowing] = useState(false)

  function handleIsShowing() {
    setIsShowing(!isShowing)
  }

  return (
    <div className={`secret-input ${className}`}>
      <input type={`${isShowing ? "text" : "password"}`} ref={ref} {...props} />
      <div className="icon-placer f-center mr-1" onClick={handleIsShowing}>
        {isShowing ? (
          <EyeClose className={size} />
        ) : (
          <EyeOpen className={size} />
        )}
      </div>
    </div>
  )
}

export default forwardRef(SecretInput)
