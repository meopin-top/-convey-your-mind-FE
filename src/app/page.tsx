import Image from "next/image"
import {WithoutSignUp, WithSignUp, WithOauth} from "@/components/app" // TODO: WithOAuth lazy loading
import {home} from "@/assets/images" // TODO: 슬로건 사진으로 교체

const Home = () => {
  return (
    <>
      <script
        defer
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.2.0/kakao.min.js"
        integrity="sha384-x+WG2i7pOR+oWb6O5GV5f1KN2Ko6N7PTGPS7UlasYWNxZMKQA63Cj/B2lbUmUfuC"
        crossOrigin="anonymous"
      />
      <script
        defer
        src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
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
