import {useState} from "react"
import {UNAUTHORIZED} from "@/constants/response-code"
import useLogOut from "./use-log-out"

type TRequestParameter = {
  path: string
  method?: "get" | "post" | "put" | "delete"
  body?: Object
}

export default function useRequest() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const logOut = useLogOut()

  const controller = new AbortController()
  const {signal} = controller
  const latestRequest = new Map<string, number>()
  const coolDownTime = 500 // 500ms 이내에 같은 요청 발생 시 무시

  async function request({path, method = "get", body}: TRequestParameter) {
    const currentTime = Date.now()
    const lastRequestTime = latestRequest.get(path)
    const isRequestDuplicated =
      lastRequestTime && currentTime - lastRequestTime < coolDownTime
    if (isRequestDuplicated) {
      controller.abort()
    }

    try {
      setIsLoading(true)

      latestRequest.set(path, currentTime)

      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api${path}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method,
          body: body ? JSON.stringify(body) : null,
          signal,
        }
      )

      if (!data.ok) {
        if (data.status >= 500) {
          throw new Error("서버 측 오류")
        } else if (data.status >= 400) {
          throw new Error("클라이언트 측 오류")
        } else {
          throw new Error("데이터 fetch 에러")
        }
      }

      const response = await data.json()

      if (response?.code === UNAUTHORIZED) {
        alert("인증이 만료되었습니다. 재로그인해주세요.")
        logOut()

        return // API 호출 쪽 구조 분해 에러는 console에만 나오고 인터렉션을 방해하진 않음
      }

      return response
    } catch (e) {
      const error = e as Error
      setError(error)

      if (error.name === "AbortError") {
        console.error("API Abortion!")
      } else {
        console.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    error,
    isLoading,
    request,
  }
}
