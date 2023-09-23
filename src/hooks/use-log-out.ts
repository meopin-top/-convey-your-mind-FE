import {useRouter} from "next/navigation"
import Storage from "@/store/local-storage"
import ROUTE from "@/constants/route"

export default function useLogOut() {
  const router = useRouter()

  function logOut() {
    Storage.remove("nickName")
    Storage.remove("profile")

    router.push(ROUTE.MAIN)

    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/users/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "delete",
    })
  }

  return logOut
}
