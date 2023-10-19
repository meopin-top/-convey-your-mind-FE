import type {ReactNode} from "react"
import {render, screen} from "@testing-library/react"
import Reducer from "@/components/Reducer"

describe("Reducer", () => {
  it("하위 컴포넌트를 올바르게 렌더링한다.", () => {
    // given, when
    const Parent = ({children}: {children: ReactNode}) => {
      return (
        <div data-testid="component-1">{children}</div>
      )
    }
    const Child = ({children}: {children: ReactNode}) => {
      return (
        <div data-testid="component-2">{children}</div>
      )
    }

    render(
      <Reducer components={[Parent, Child]}>
        <div data-testid="component-3" />
      </Reducer>
    )

    const component1 = screen.getByTestId("component-1")
    const child = component1.firstChild
    const component2 = screen.getByTestId("component-2")
    const grandchild = component2.firstChild
    const component3 = screen.getByTestId("component-3")

    // then
    expect(component1).toBeInTheDocument()
    expect(child).toEqual(component2)
    expect(component2).toBeInTheDocument()
    expect(grandchild).toEqual(component3)
    expect(component3).toBeInTheDocument()
  })
})