import {useState} from "react"

type TRequestParameter = {
  path: string
  method?: "get" | "post" | "put" | "delete"
  body?: Object
}

export default function useRequest() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown | null>(null)

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

      return await data.json()
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
