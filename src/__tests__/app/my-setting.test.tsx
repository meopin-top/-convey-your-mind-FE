// https://github.com/vercel/next.js/discussions/44270
// src/app/my/setting/page.tsx 를 import하면 에러 발생
// testEnvironment를 바꾸면 document가 정의되지 않았다고 에러 발생
// => 간단한 테스트 컴포넌트 선언 후에 테스트

import {render, screen} from "@testing-library/react"
import {redirect} from "next/navigation"
import {ROUTE} from "@/constants/service"

const MySetting = ({headers}: {headers: jest.Mock}) => {
  const referer = headers().get("referer")

  if (!referer) {
    redirect(ROUTE.MY_PAGE)

    return <></>
  }

  const isNotFromMyPage =
    !(referer as string).endsWith(ROUTE.MY_PAGE) &&
    !(referer as string).endsWith(ROUTE.MY_SETTING) &&
    !(referer as string).endsWith(ROUTE.MY_SETTING_PROFILE)
  if (isNotFromMyPage) {
    redirect(ROUTE.MY_PAGE)

    return <></>
  }

  return <div>MySetting</div>
}

jest.mock("next/navigation", () => ({
  __esModule: true,
  redirect: jest.fn(),
}))

describe("MySetting", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("referer이 없으면 마이 페이지로 리다이렉트된다.", () => {
    // given, when
    const headers = jest.fn().mockReturnValueOnce({
      get: jest.fn().mockReturnValueOnce(null),
    })

    render(<MySetting headers={headers} />)

    const component = screen.queryByText("MySetting")

    // then
    expect(redirect).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    expect(component).not.toBeInTheDocument()
  })

  it("referer이 마이 페이지나 세팅 페이지, 프로필 이미지 조정 페이지가 아니라면 마이 페이지로 리다이렉트된다.", () => {
    // given, when
    const headers = jest.fn().mockReturnValueOnce({
      get: jest.fn().mockReturnValueOnce("https://www.testdomain.com/"),
    })

    render(<MySetting headers={headers} />)

    const component = screen.queryByText("MySetting")

    // then
    expect(redirect).toHaveBeenCalledWith(ROUTE.MY_PAGE)
    expect(component).not.toBeInTheDocument()
  })

  it("referer이 올바르면 컴포넌트를 렌더링한다.", () => {
    // given, when
    const headers = jest.fn().mockReturnValueOnce({
      get: jest
        .fn()
        .mockReturnValueOnce(`https://www.testdomain.com/${ROUTE.MY_PAGE}`),
    })

    render(<MySetting headers={headers} />)

    const component = screen.getByText("MySetting")

    // then
    expect(redirect).not.toHaveBeenCalled()
    expect(component).toBeInTheDocument()
  })
})
