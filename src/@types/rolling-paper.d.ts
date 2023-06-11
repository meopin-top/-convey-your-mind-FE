export type TCanvasElement = "textarea" | "img"

export type TStore = {
  drawingMode: CanvasElement | null
  resetDrawingMode: () => void
}
