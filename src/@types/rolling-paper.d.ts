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

export type TStore = {
  toWhom: string
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

export type TContentType = "text" | "image" | ""

export type TRollingPaperTextContent = {
  user_id: string
  content_id: string
  content_type: "text"
  x: number
  y: number
  width: number
  height: number
  text: string
  sender: string
}

export type TRollingPaperImageContent = {
  user_id: string
  content_id: string
  content_type: "image"
  x: number
  y: number
  width: number
  height: number
  image_url: string
  sender: string
}

export type TRollingPaperContentSize = {
  width: number
  height: number
}

export type TRollingPaperContent =
  | TRollingPaperTextContent
  | TRollingPaperImageContent

export type TRollingPaperContents =
  | TRollingPaperImageContent[]
  | TRollingPaperTextContent[]

export type TPosition = {pageY: number; pageX: number}
