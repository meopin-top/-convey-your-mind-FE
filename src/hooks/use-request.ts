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
  const [error, setError] = useState<unknown | null>(null)

  const logOut = useLogOut()

  async function request({path, method = "get", body}: TRequestParameter) {
    try {
      setIsLoading(true)

      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api${path}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method,
          body: body ? JSON.stringify(body) : null,
        }
      )

      if (!data.ok) {
        throw new Error("데이터 fetch 에러 발생")
      }

      const response = await data.json()

      if (response?.code === UNAUTHORIZED) {
        alert("인증이 만료되었습니다. 재로그인해주세요.")
        logOut()

        return // API 호출 쪽 구조 분해 에러는 console에만 나오고 인터렉션을 방해하진 않음
      }

      return response
    } catch (error) {
      setError(error)
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
