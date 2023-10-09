"use client"

import {
  useState,
  forwardRef,
  type InputHTMLAttributes,
  type ForwardedRef,
} from "react"
import {EyeClose, EyeOpen} from "@/assets/icons"
import type {TIconSize} from "@/@types/style"

export type TProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  size?: TIconSize
}

const SecretInput = (
  {className, size = "md", ...props}: TProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
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

export default forwardRef<HTMLInputElement, TProps>(SecretInput)
