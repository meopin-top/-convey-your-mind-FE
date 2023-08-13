import {render, screen, fireEvent} from "@testing-library/react"
import useBodyScrollLock from "@/hooks/use-body-scroll-lock"

const scrollY = 100

const TestComponent = () => {
  const {lockScroll, unlockScroll} = useBodyScrollLock()

  return (
    <>
      <button onClick={lockScroll}>lock</button>
      <button onClick={unlockScroll}>unlock</button>
    </>
  )
}

describe("useBodyScrollLock", () => {
  beforeAll(() => {
    window.scrollY = scrollY
    window.scrollTo = jest.fn()
  })

  afterAll(() => {
    delete (window as any).scrollY
    delete (window as any).scrollTo
  })

  it("lockScroll을 호출하면 body 스크롤 이동을 못하도록 스타일이 설정된다.", () => {
    // given
    render(<TestComponent />)

    const lockButton = screen.getByRole("button", {name: "lock"})

    // when
    fireEvent.click(lockButton)

    // then
    expect(document.body.style.overflow).toEqual("hidden")
    expect(document.body.style.position).toEqual("fixed")
    expect(document.body.style.top).toEqual(`-${scrollY}px`)
    expect(document.body.style.width).toEqual("100%")
  })

  it("unlockScroll을 호출하면 body 스크롤 이동이 가능하도록 스타일이 설정된다.", () => {
    // given
    render(<TestComponent />)

    const openButton = screen.getByRole("button", {name: "unlock"})

    // when
    fireEvent.click(openButton)

    // then
    expect(document.body.style.overflow).toEqual("")
    expect(document.body.style.position).toEqual("")
    expect(document.body.style.top).toEqual("")
    expect(document.body.style.width).toEqual("")
  })
})
