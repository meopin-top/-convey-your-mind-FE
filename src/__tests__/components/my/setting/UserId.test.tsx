import {render, screen} from "@testing-library/react"
import Component from "@/components/my/setting/UserId"
import {UserIdStore} from "@/components/my/setting/Context"

const USER_ID = "userId"

const UserId = () => {
  return (
    <UserIdStore.Provider value={{userId: USER_ID, setUserId: jest.fn()}}>
      <Component />
    </UserIdStore.Provider>
  )
}

describe("UserId", () => {
  it("올바르게 렌더링한다.", () => {
    // given, when
    render(<UserId />)

    const userId = screen.getByText(new RegExp(USER_ID))

    expect(userId).toBeInTheDocument()
  })
})