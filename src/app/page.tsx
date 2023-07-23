import Image from "next/image"
import {NeedNotLoggedIn} from "@/components"
import {WithoutSignUp, WithSignUp, WithOauth} from "@/components/app"
import {home} from "@/assets/images" // TODO: 슬로건 사진으로 교체

const Home = () => {
  return (
    <>
      <NeedNotLoggedIn />

      <div className="home root-wrapper">
        <header className="header">
          <Image src={home} alt="슬로건" loading="eager" height={60} />
          <section className="subtitle">
            subtitle 영역, 최대 2줄 정도 소개 문구? 느낌으로 넣으면 좋을듯!
          </section>
        </header>

        <main className="main f-center">
          <WithoutSignUp />
          <WithSignUp />
          <WithOauth />
        </main>
      </div>
    </>
  )
}

export default Home
