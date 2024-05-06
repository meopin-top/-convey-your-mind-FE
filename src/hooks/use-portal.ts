"use client"

import {useState, useEffect} from "react"

// 테스트 필요 X
export default function usePortal() {
  const [portal, setPortal] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const portal = document.getElementById("portal") as HTMLElement

    setPortal(portal)
  }, [])

  return portal
}
