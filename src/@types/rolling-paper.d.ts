import {PROJECT_TYPE, ROLLING_PAPER_STATUS} from "@/constants/request"

export type TCreationInformation =
  | "WHOM"
  | "PERSONNEL"
  | "TYPE"
  | "DUE_DATE"
  | "SHARING_CODE"

export type TDoneStep = {
  [step in TCreationInformation]: boolean
}

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

export type TRollingPaperInformation = {
  id: number
  inviteCode: string
  maxInviteNum: number
  destination: string
  type: (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE]
  status: keyof typeof ROLLING_PAPER_STATUS
  expiredDatetime: string
  owner: boolean
}
