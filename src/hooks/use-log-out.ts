import {useRouter} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

export default function useLogOut() {
  const router = useRouter()

  function logOut() {
    Storage.remove("nickName")
    Storage.remove("profile")

    router.push(ROUTE.MAIN)
  }

  return logOut
}
