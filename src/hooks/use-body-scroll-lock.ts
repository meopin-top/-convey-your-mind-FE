import {useCallback} from "react"

type TScrollLock = {
  lockScroll: () => void
  unlockScroll: () => void
}

export default function useBodyScrollLock(): TScrollLock {
  let scrollPosition = 0

  const lockScroll = useCallback(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    scrollPosition = window.scrollY
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = "100%"
  }, [])

  const unlockScroll = useCallback(() => {
    document.body.style.removeProperty("overflow")
    document.body.style.removeProperty("position")
    document.body.style.removeProperty("top")
    document.body.style.removeProperty("width")
    window.scrollTo(0, scrollPosition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {lockScroll, unlockScroll}
}
