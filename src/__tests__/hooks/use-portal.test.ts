import {renderHook} from "@testing-library/react-hooks" // react 17 warning 발생
import usePortal from "@/hooks/use-portal"

describe("usePortal", () => {
  it("첫 렌더링 시 portal은 null이다.", () => {
    // given, when
    const {result: portal} = renderHook(() => usePortal())

    // then
    expect(portal.current).toBeNull()
  })

  it("리렌더링 시 portal은 div element이다.", () => {
    // given, when
    const portalElement = document.createElement("div")
    portalElement.id = "portal"
    document.body.appendChild(portalElement)

    const {result: portal} = renderHook(() => usePortal())

    // then
    expect(portal.current).toEqual(portalElement)
  })
})
