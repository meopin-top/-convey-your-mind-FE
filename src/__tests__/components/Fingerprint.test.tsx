import {render, waitFor} from "@testing-library/react"
import Fingerprint from "@/components/Fingerprint"
import {
  createLocalStorageMock,
  removeLocalStorageMock,
} from "@/__mocks__/window"

const feature = ""

jest.mock("../../hooks/use-fingerprint.ts", () => ({
  __esModule: true,
  default: () => ({
    feature,
    getHash: jest.fn().mockResolvedValue(feature),
  }),
}))

describe("Fingerprint", () => {
  beforeAll(() => {
    createLocalStorageMock()
  })

  afterAll(() => {
    removeLocalStorageMock()
  })

  it("렌더링 시 로컬스토리지 fingerprint가 set된다.", async () => {
    // given, when
    await waitFor(() => {
      render(<Fingerprint />)
    })

    // then
    expect(window.localStorage.setItem).toBeCalledWith("fingerprint", feature)
  })
})
