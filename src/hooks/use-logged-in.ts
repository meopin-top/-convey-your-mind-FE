import {useLayoutEffect} from "react"
import {useRouter} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

export default function useNeedLoggedIn() {
  const router = useRouter()

  useLayoutEffect(() => {
    const isNotLoggedIn = !new Storage().get("nickName")

    if (isNotLoggedIn) {
      alert("로그인 후에 서비스 이용해주세요.")

      router.replace(ROUTE.LOGIN)
    }
  }, [router])
}

// export function
