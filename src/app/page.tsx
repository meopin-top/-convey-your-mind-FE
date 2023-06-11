"use client"

import Image from "next/image"
import {List, Plus} from "@/assets/icons"
import {home} from "@/assets/images"
import PortalLoading from "@/components/PortalLoading"

const Home = () => {
  return (
    <>
      <PortalLoading isLoading={true} blur={true} />
      <List className="lg" />
      <Plus className="lg" />
      <br />
      <input type="file" accept="image/*;capture=camera" />
      <br />
      <Image src={home} alt="메인 페이지입니다." width={720} />
    </>
  )
}

export default Home
