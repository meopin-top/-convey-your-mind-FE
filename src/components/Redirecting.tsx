"use client"

import type {HTMLAttributes, MouseEvent} from "react"
import Image from "next/image"
import {FadingSquares} from "@/assets/gifs"

export type TProps = {
  isRedirecting: boolean
  blur?: boolean
} & HTMLAttributes<HTMLDivElement>

const Redirecting = ({isRedirecting, blur = false, ...props}: TProps) => {
  function preventEvent(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  return (
    <>
      {isRedirecting && (
        <div
          id="redirecting"
          className={`f-center ${blur ? "blur" : ""}`}
          onClick={preventEvent}
          {...props}
        >
          <Image src={FadingSquares} alt="리다이렉션 중..." role="status" />
        </div>
      )}
    </>
  )
}

export default Redirecting
