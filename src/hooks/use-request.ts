import {useState, useEffect} from "react"
import {get} from "../api"

export default function useRequest<T>(path: string) {
  const [error, setError] = useState<unknown | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const {data} = await get(path)
        setData(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    error,
    isLoaded,
    data,
  }
}
