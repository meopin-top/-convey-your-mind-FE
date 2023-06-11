"use client"

import {useEffect} from "react"
import Image from "next/image"
import {pageNotFound} from "@/assets/images"

const NotFound = () => {
  useEffect(() => {
    alert("존재하지 않는 페이지입니다.")
  }, [])

  return (
    <Image src={pageNotFound} alt="존재하지 않는 페이지입니다." width={720} />
  )
}

export default NotFound
