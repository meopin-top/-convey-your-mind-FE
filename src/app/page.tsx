import Image from "next/image"
import {WithoutSignUp, WithSignUp, WithOauth} from "@/components/app"
import {home} from "@/assets/images" // TODO: 슬로건 사진으로 교체

const Home = () => {
  // TODO: 로그인 됐으면 my로 리다이렉트

  return (
    <>
      <script
        defer
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.2.0/kakao.min.js"
        integrity="sha384-x+WG2i7pOR+oWb6O5GV5f1KN2Ko6N7PTGPS7UlasYWNxZMKQA63Cj/B2lbUmUfuC"
        crossOrigin="anonymous"
      />
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
