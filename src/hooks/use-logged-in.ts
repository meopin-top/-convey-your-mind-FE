import {useState, useLayoutEffect} from "react"
import {useRouter} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

function useCheckLoginStatus(shouldBeLoggedIn: boolean): boolean {
  const [isRedirecting, setIsRedirecting] = useState(true)
  const router = useRouter()

  useLayoutEffect(() => {
    const isLoggedIn = Storage.get("nickName")

    if (shouldBeLoggedIn && !isLoggedIn) {
      alert("로그인 후에 서비스를 이용해주세요.")
      router.push(ROUTE.MAIN)
    } else if (!shouldBeLoggedIn && isLoggedIn) {
      router.push(ROUTE.MY_PAGE)
    } else {
      setIsRedirecting(false)
    }
  }, [router, shouldBeLoggedIn])

  return isRedirecting
}

export function useNeedLoggedIn(): boolean {
  return useCheckLoginStatus(true)
}

export function useNeedNotLoggedIn(): boolean {
  return useCheckLoginStatus(false)
}
