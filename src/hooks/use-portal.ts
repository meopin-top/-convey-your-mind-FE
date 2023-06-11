import {useState, useEffect} from "react"

export default function usePortal() {
  const [portal, setPortal] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const portal = document.getElementById("portal") as HTMLElement

    setPortal(portal)
  }, [])

  return portal
}
