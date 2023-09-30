import {useRef, useCallback, type MouseEvent} from "react"

type TCoordinate = {
  startX: number | null
  startY: number | null
  endX: number | null
  endY: number | null
}

export default function useMouseTracker() {
  const mouseTracker = useRef<TCoordinate>({
    startX: null,
    startY: null,
    endX: null,
    endY: null,
  })

  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const {offsetX, offsetY} = event.nativeEvent

    mouseTracker.current.startX = offsetX
    mouseTracker.current.startY = offsetY
  }, [])

  const handleMouseUp = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const {offsetX, offsetY} = event.nativeEvent

    mouseTracker.current.endX = offsetX
    mouseTracker.current.endY = offsetY
  }, [])

  const getCoordinate = useCallback(
    () => ({...mouseTracker.current}),
    [mouseTracker]
  )

  return {handleMouseDown, handleMouseUp, getCoordinate}
}
