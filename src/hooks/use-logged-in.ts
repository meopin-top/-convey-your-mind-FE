import {useState, useLayoutEffect} from "react"
import {useRouter} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

export function useNeedLoggedIn(): boolean {
  const [isPainted, setIsPainted] = useState(false)
  const router = useRouter()

  useLayoutEffect(() => {
    const isNotLoggedIn = !new Storage().get("nickName")

    if (isNotLoggedIn) {
      alert("로그인 후에 서비스 이용해주세요.")

      router.push(ROUTE.MAIN)
    }

    setIsPainted(true)
  }, [router])

  return isPainted
}

export function useNeedNotLoggedIn(): boolean {
  const [isPainted, setIsPainted] = useState(false)
  const router = useRouter()

  useLayoutEffect(() => {
    const isLoggedIn = new Storage().get("nickName")

    if (isLoggedIn) {
      router.push(ROUTE.MY_PAGE)
    }

    setIsPainted(true)
  }, [router])

  return isPainted
}
