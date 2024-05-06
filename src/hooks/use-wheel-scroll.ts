"use client"

import type {MouseEvent} from "react"

export default function useWheelScroll() {
  let isMouseDown = false

  function handleMouseDown(event: MouseEvent) {
    if (event.button === 1) {
      event.preventDefault()

      isMouseDown = true
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (isMouseDown) {
      window.scrollBy(-event.movementX, -event.movementY)
    }
  }

  function handleMouseUp(event: MouseEvent) {
    if (event.button === 1) {
      isMouseDown = false
    }
  }

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
