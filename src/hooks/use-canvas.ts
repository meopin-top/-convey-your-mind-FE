import {useState, useEffect} from "react"
import type Item from "@/helpers/canvas"

type TCanvasComponent = HTMLDivElement | null

export default function useCanvas() {
  const [wrapper, setWrapper] = useState<TCanvasComponent>(null)
  const [contentPreview, setContentPreview] = useState<TCanvasComponent>(null)
  const [isConfirmAlerting, setIsConfirmAlerting] = useState(false)
  const [isRemovalAlerting, setIsRemovalAlerting] = useState(false)

  useEffect(() => {
    setWrapper(getWrapper())
  }, [])

  function getWrapper() {
    return document.querySelector(".root-wrapper") as HTMLDivElement
  }

  function createContent(item: Item) {
    item.setStyle()
    item.setInner()
    item.setEvent({
      onClickConfirmation: () => setIsConfirmAlerting(true),
      onClickClose: () => setIsRemovalAlerting(true),
    })
    item.show(getWrapper())
    item.positionSender()
    setContentPreview(item.getContentPreview())
  }

  function removeContent() {
    if (!wrapper || !contentPreview) {
      return
    }

    wrapper.removeChild(contentPreview)
    setContentPreview(null)
    closeRemovalAlerting()
  }

  function closeConfirmAlerting() {
    setIsConfirmAlerting(false)
  }

  function closeRemovalAlerting() {
    setIsRemovalAlerting(false)
  }

  return {
    isConfirmAlerting,
    closeConfirmAlerting,
    isRemovalAlerting,
    closeRemovalAlerting,
    contentPreview,
    createContent,
    removeContent,
  }
}
