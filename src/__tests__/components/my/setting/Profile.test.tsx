import {render, screen, fireEvent} from "@testing-library/react"
import Component from "@/components/my/setting/Profile"
import {ProfileStore} from "@/components/my/setting/Context"

const setProfileMock = jest.fn()

const Profile = () => {
  return (
    <ProfileStore.Provider value={{profile: "https://test-domain.com/profile", setProfile: setProfileMock}}>
      <Component />
    </ProfileStore.Provider>
  )
}

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({src, onClick}: {src: string, onClick: () => void}) => <img src={src} alt="프로필 이미지" onClick={onClick} />
}))
const requestMock = jest.fn()
jest.mock("../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false
  })
}))
jest.mock("../../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <div>loading...</div>
}))

describe("Profile", () => {
  it("총 7개의 이미지와 '내 사진 가져오기' 버튼이 올바르게 렌더링한다.", () => {
    // given, when
    render(<Profile />)

    const profileImages = screen.getAllByRole("img")
    const uploadProfileButton = screen.getByRole("button", {name: /내 사진 가져오기/})

    // then
    expect(profileImages.length).toEqual(7)
    expect(uploadProfileButton).toBeInTheDocument()
  })

  // TODO: API 연동 후 '리스트에서 선택하기' 프로필 이미지 업데이트 추가
  // TODO: '내 사진 가져오기' 버튼 클릭 후 인터렉션 추가

  it("'리스트에서 선택하기'의 있는 프로필 이미지를 눌렀을 때 'selected' 클래스가 추가되고 선택된 프로필 이미지가 변경된다.", () => {
    // given
    render(<Profile />)

    const profileImages = screen.getAllByRole("img") as HTMLImageElement[]
    const defaultProfileImages = profileImages.slice(1)

    // when
    fireEvent.click(defaultProfileImages[0])

    // then
    expect(setProfileMock).toHaveBeenCalledWith(defaultProfileImages[0].src)

    // when
    fireEvent.click(defaultProfileImages[5])

    // then
    expect(setProfileMock).toHaveBeenCalledWith(defaultProfileImages[5].src)
  })
})
