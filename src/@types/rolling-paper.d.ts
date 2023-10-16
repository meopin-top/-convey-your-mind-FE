export type TCreationInformation =
  | "WHOM"
  | "PERSONNEL"
  | "TYPE"
  | "DUE_DATE"
  | "SHARING_CODE"

export type TDueDateType = "DATE" | "D_DAY" | "NONE"

export type TRollingPaperType = {
  template: string
  text: string
}

export type TCanvasElement = "textarea" | "img"

export type TStore = {
  drawingMode: CanvasElement | null
  resetDrawingMode: () => void
}
