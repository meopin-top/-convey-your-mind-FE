type TScrollLock = {
  lockScroll: () => void
  openScroll: () => void
}

export default function useBodyScrollLock(): TScrollLock {
  let scrollPosition = 0

  const lockScroll = () => {
    scrollPosition = window.pageYOffset
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = "100%"
  }

  const openScroll = () => {
    document.body.style.removeProperty("overflow")
    document.body.style.removeProperty("position")
    document.body.style.removeProperty("top")
    document.body.style.removeProperty("width")
    window.scrollTo(0, scrollPosition)
  }

  return {lockScroll, openScroll}
}
