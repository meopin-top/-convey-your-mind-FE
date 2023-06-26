import {useLayoutEffect} from "react"
import {useRouter} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

export default function useNeedLoggedIn() {
  const router = useRouter()

  useLayoutEffect(() => {
    const isNotLoggedIn = !new Storage().get("accessToken")

    if (isNotLoggedIn) {
      router.replace(ROUTE.LOGIN)
    }
  }, [router])
}
