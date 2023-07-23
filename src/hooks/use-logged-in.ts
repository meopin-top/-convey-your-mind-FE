import {useLayoutEffect} from "react"
import {redirect} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

export function useNeedLoggedIn() {
  useLayoutEffect(() => {
    const isNotLoggedIn = !new Storage().get("nickName")

    if (isNotLoggedIn) {
      alert("로그인 후에 서비스 이용해주세요.")

      redirect(ROUTE.MAIN)
    }
  }, [])
}

export function useNeedNotLoggedIn() {
  useLayoutEffect(() => {
    const isLoggedIn = new Storage().get("nickName")

    if (isLoggedIn) {
      redirect(ROUTE.MY_PAGE)
    }
  }, [])
}
