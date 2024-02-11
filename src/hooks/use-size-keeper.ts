"use client"

import {useState, useEffect} from "react"
import {debounce} from "@/utils/optimization"
import type {TPosition} from "@/@types/viewport"

export default function useSizeKeeper(initialSizes: number[]) {
  const [sizes, setSizes] = useState([...initialSizes])
  const [position, setPosition] = useState<TPosition>({
    top: 0,
    left: 0,
    width: 0,
  })

  useEffect(() => {
    if (!visualViewport || visualViewport.height === 0) {
      return
    }

    const initialHeight = visualViewport.height

    function maintainSize() {
      if (!visualViewport || visualViewport.height === 0) {
        return
      }

      const currentHeight = visualViewport.height
      const ratio = currentHeight / initialHeight

      setSizes(initialSizes.map((size) => size * ratio))
      setPosition({
        top: visualViewport.offsetTop,
        left: visualViewport.offsetLeft,
        width: visualViewport.width,
      })
    }

    const maintainSizeWithDelay = debounce(maintainSize, 50)

    function pinchZoomResizeHandler(event: TouchEvent) {
      if (event.touches.length !== 2) {
        return
      }

      maintainSizeWithDelay()
    }

    window.addEventListener("resize", maintainSize)
    window.addEventListener("touchmove", pinchZoomResizeHandler)
    window.addEventListener("wheel", maintainSizeWithDelay)

    return () => {
      window.removeEventListener("resize", maintainSize)
      window.removeEventListener("touchmove", pinchZoomResizeHandler)
      window.removeEventListener("wheel", maintainSizeWithDelay)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {sizes, position}
}
