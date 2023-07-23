import {useState, useLayoutEffect} from "react"
import {useRouter} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

function useCheckLoginStatus(shouldBeLoggedIn: boolean): boolean {
  const [isPainted, setIsPainted] = useState(false)
  const router = useRouter()

  useLayoutEffect(() => {
    const isLoggedIn = new Storage().get("nickName")

    if (shouldBeLoggedIn && !isLoggedIn) {
      alert("로그인 후에 서비스를 이용해주세요.")
      router.push(ROUTE.MAIN)
    } else if (!shouldBeLoggedIn && isLoggedIn) {
      router.push(ROUTE.MY_PAGE)
    }

    setIsPainted(true)
  }, [router, shouldBeLoggedIn])

  return isPainted
}

export function useNeedLoggedIn(): boolean {
  return useCheckLoginStatus(true)
}

export function useNeedNotLoggedIn(): boolean {
  return useCheckLoginStatus(false)
}
