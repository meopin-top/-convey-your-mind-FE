"use client"

import {useContext} from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import Store from "@/store/viewport"
import {logo} from "@/assets/images"

const NavigationBar = dynamic(() => import("./NavigationBar"), {
  loading: () => <></>,
})

type TProps = {
  isControllingScroll?: boolean
}

const Header = ({isControllingScroll = true}: TProps) => {
  const {
    sizes: [logoSize, menuSize, padding],
    position,
  } = useContext(Store)

  return (
    <>
      <header
        style={{
          top: position.top,
          left: position.left,
          width: position.width !== 0 ? position.width : "100%",
          padding: `${padding / 2}px ${padding}px`,
        }}
        id="header"
      >
        <Image src={logo} alt="logo" width={logoSize} height={logoSize} />
        <NavigationBar
          size={menuSize}
          isControllingScroll={isControllingScroll}
        />
      </header>
      <div className="block" style={{height: logoSize}} />
    </>
  )
}

export default Header
