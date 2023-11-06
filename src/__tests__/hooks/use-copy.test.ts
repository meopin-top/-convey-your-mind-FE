import useCopy from "@/hooks/use-copy"
import {
  createWriteTextMock,
  removeWriteTextMock,
  createExecCommandMock,
  removeExecCommandMock
} from "@/__mocks__/window"

describe("useCopy", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("clipboard API가 지원되면 'copyWithClipboard' 함수를 실행한다", async () => {
    // given, when
    createWriteTextMock()

    const TEXT = "Test Text"

    const {copy} = useCopy()
    await copy(TEXT)

    // then
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(TEXT)

    // clean up
    removeWriteTextMock()
  })

  it("clipboard API가 지원되지 않으면 'copyWithExecCommand' 함수를 실행한다", async () => {
    // given, when
    createExecCommandMock()

    const {copy} = useCopy()
    await copy("Test Text2")

    // then
    expect(document.execCommand).toHaveBeenCalledWith("copy")

    // clean up
    removeExecCommandMock()
  })
})