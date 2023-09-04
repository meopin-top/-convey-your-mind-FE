import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import {logo} from "@/assets/images"
import ROUTE from "@/constants/route"

const NavigationBar = dynamic(() => import("./NavigationBar"), {
  loading: () => <></>,
})

const Header = () => {
  return (
    <header className="mb-4">
      {/* 현재로서는 Header를 로그인한 이후의 페이지에서만 사용하기 때문에 MY_PAGE로 이동 */}
      <Link href={ROUTE.MY_PAGE}>
        <Image src={logo} alt="logo" height={32} />
      </Link>
      <NavigationBar />
    </header>
  )
}

export default Header
