import {render, screen, fireEvent} from "@testing-library/react"
import type {ReactNode} from "react"
import Component from "@/components/my/setting/Profile"
import {ProfileStore} from "@/components/my/setting/Context"
import {ROUTE} from "@/constants/service"

const setProfileMock = jest.fn()
const getSearchParamsMock = jest.fn()
const routerPushMock = jest.fn()
const requestMock = jest.fn()

const Profile = () => {
  return (
    <ProfileStore.Provider
      value={{
        profile: {
          type: "uploadUrl",
          url: "https://test-domain.com/profile",
          data: "",
        },
        setProfile: setProfileMock,
      }}
    >
      <Component />
    </ProfileStore.Provider>
  )
}

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({src, onClick}: {src: string; onClick: () => void}) => (
    <img src={src} alt="프로필 이미지" onClick={onClick} />
  ),
}))
jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => ({
    get: getSearchParamsMock,
  }),
  useRouter: () => ({
    push: routerPushMock,
  }),
}))
jest.mock("react-image-crop", () => ({
  __esModule: true,
  default: () => <></>,
}))
jest.mock("../../../../hooks/use-request.ts", () => ({
  __esModule: true,
  default: () => ({
    request: requestMock,
    isLoading: false,
  }),
}))
jest.mock("../../../../hooks/use-image-crop.ts", () => ({
  __esModule: true,
  default: () => ({
    convertBlobToDataUrl: jest.fn(),
    makeCropAsBlobImage: jest.fn().mockReturnValue({}),
    revokeBlob: jest.fn(),
    revokeImage: jest.fn(),
    image: "image",
  }),
}))
jest.mock("../../../../components/Loading.tsx", () => ({
  __esModule: true,
  default: () => <div>loading...</div>,
}))
jest.mock("../../../../components/BottomSheet.tsx", () => ({
  __esModule: true,
  default: ({children}: {children: ReactNode}) => <>{children}</>,
}))

describe("Profile", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("총 7개의 이미지와 '내 사진 가져오기' 버튼이 올바르게 렌더링한다.", () => {
    // given, when
    render(<Profile />)

    const profileImages = screen.getAllByRole("img")
    const uploadProfileButton = screen.getByRole("button", {
      name: /내 사진 가져오기/,
    })

    // then
    expect(profileImages.length).toEqual(7)
    expect(uploadProfileButton).toBeInTheDocument()
  })

  // TODO: API 연동 후 '리스트에서 선택하기' 프로필 이미지 업데이트 추가

  it("사진을 업로드하면 프로필 설정 페이지로 이동한다", () => {
    // given
    const file = new File([], "test.png", {type: "image/png"})

    render(<Profile />)

    const fileInput = screen.getByLabelText("내 사진 가져오기")

    // when
    fireEvent.change(fileInput, {target: {files: [file]}})

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_SETTING_PROFILE)
  })

  it("'사진 가져오기' 버튼을 누르면 내 설정 페이지로 이동한다.", () => {
    // given
    render(<Profile />)

    const getImageButton = screen.getByRole("button", {
      name: "사진 가져오기",
    })

    // when
    fireEvent.click(getImageButton)

    // then
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE.MY_SETTING)
  })

  it("'리스트에서 선택하기'의 있는 프로필 이미지를 눌렀을 때 'selected' 클래스가 추가되고 선택된 프로필 이미지가 변경된다.", () => {
    // given
    render(<Profile />)

    const profileImages = screen.getAllByRole("img") as HTMLImageElement[]
    const defaultProfileImages = profileImages.slice(1)

    // when
    fireEvent.click(defaultProfileImages[0])

    // then
    expect(setProfileMock).toHaveBeenCalledWith({
      type: "uploadUrl",
      url: defaultProfileImages[0].src,
      data: defaultProfileImages[0].src,
    })

    // when
    fireEvent.click(defaultProfileImages[5])

    // then
    expect(setProfileMock).toHaveBeenCalledWith({
      type: "uploadUrl",
      url: defaultProfileImages[5].src,
      data: defaultProfileImages[5].src,
    })
  })
})
