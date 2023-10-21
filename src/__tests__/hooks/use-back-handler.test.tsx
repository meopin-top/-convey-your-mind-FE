import {render} from "@testing-library/react"
import useBackHandler from "@/hooks/use-back-handler"

const TestComponent = ({backHandler}: {backHandler: () => any}) => {
  useBackHandler(backHandler)

  return <>test component</>
}

describe("useBodyScrollLock", () => {
  it("popstate 이벤트가 발생하면 backHandler가 호출되어야 한다.", () => {
    // given
    const backHandler = jest.fn()

    render(<TestComponent backHandler={backHandler} />)

    // when
    const popstateEvent = new Event("popstate")
    global.window.dispatchEvent(popstateEvent)

    // then
    expect(backHandler).toHaveBeenCalled()
  })
})
