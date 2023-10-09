import {useEffect} from "react"

export default function useBackHandler(backHandler: () => any) {
  useEffect(() => {
    history.pushState(null, "", location.href)
    window.addEventListener("popstate", backHandler)

    return () => {
      window.removeEventListener("popstate", backHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
