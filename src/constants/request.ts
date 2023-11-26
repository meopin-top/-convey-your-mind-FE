export const ROLLING_PAPER_TYPE = {
  FREELY: "D", // default
} as const

export const PROJECT_TYPE = {
  PARTICIPANT: "E",
  RECEIVER: "D",
} as const

export const ROLLING_PAPER_STATUS = {
  R: "작성 전", // READY
  C: "참여 완료", // COMPLETE
  D: "전달 완료", // DELIVERED
} as const
