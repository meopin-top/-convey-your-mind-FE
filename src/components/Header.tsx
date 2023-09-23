import Image from "next/image"
import dynamic from "next/dynamic"
import {logo} from "@/assets/images"

const NavigationBar = dynamic(() => import("./NavigationBar"), {
  loading: () => <></>,
})

const Header = () => {
  return (
    <header className="mb-4">
      <Image src={logo} alt="logo" height={32} />
      <NavigationBar />
    </header>
  )
}

export default Header
