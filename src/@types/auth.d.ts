import {SIGN_IN} from "@/constants/response-code"

declare global {
  interface Window {
    Kakao: any
  }
}

export type TSignInResponse = {
  message: string
  code: (typeof SIGN_IN)[keyof typeof SIGN_IN]
  data: {
    userId: string
    email: string
    nickName: string
    authMethod: string
    profile: string
  }
}
