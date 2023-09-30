export type TCreationInformation =
  | "WHOM"
  | "PERSONNEL"
  | "TYPE"
  | "SHARING_CODE"

export type TCanvasElement = "textarea" | "img"

export type TStore = {
  drawingMode: CanvasElement | null
  resetDrawingMode: () => void
}
