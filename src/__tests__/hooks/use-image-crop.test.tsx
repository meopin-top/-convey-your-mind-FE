import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import useImageCrop from "@/hooks/use-image-crop"
import {
  createCreateObjectURL,
  createOffscreenCanvas,
  createRevokeObjectURL,
  removeCreateObjectURL,
  removeOffscreenCanvas,
  removeRevokeObjectURL,
} from "@/__mocks__/window"

const DEFAULT_IMAGE_SRC = "http://localhost/"

describe("useImageCrop", () => {
  beforeEach(() => {
    createCreateObjectURL("blob://www.test.com")
    createRevokeObjectURL()
    createOffscreenCanvas()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    removeCreateObjectURL()
    removeRevokeObjectURL()
    removeOffscreenCanvas()
  })

  it("'convertBlobToDataUrl'은 file을 읽어 이미지로 변환한다.", async () => {
    // given
    const Component = ({file}: {file: File}) => {
      const aspect = 1
      const {image, convertBlobToDataUrl} = useImageCrop(aspect)

      return (
        <>
          <button onClick={() => convertBlobToDataUrl(file)}>click</button>
          <img src={image} alt="image" />
        </>
      )
    }

    const imageFile = new File([], "text.png", {type: "image/png"})
    render(<Component file={imageFile} />)

    const convertButton = screen.getByRole("button", {name: "click"})

    // when
    await waitFor(() => {
      fireEvent.click(convertButton)
    })

    // then
    const image = screen.getByAltText("image") as HTMLImageElement

    await waitFor(() => {
      expect(image.src).not.toEqual(DEFAULT_IMAGE_SRC)
    })
  })

  it("'revokeBlob'은 ref가 없다면 'URL.revokeObjectURL'을 호출하지 않는다.", async () => {
    // given
    const Component = () => {
      const aspect = 1
      const {revokeBlob} = useImageCrop(aspect)

      return <button onClick={revokeBlob}>revoke</button>
    }

    render(<Component />)

    const revokeButton = screen.getByRole("button", {name: "revoke"})

    // when
    fireEvent.click(revokeButton)

    // then
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
  })

  it("'revokeBlob'은 ref가 있다면 'URL.revokeObjectURL'을 호출한다.", async () => {
    // given
    const Component = () => {
      const aspect = 1
      const {
        imageRef,
        image,
        setCompletedCrop,
        makeCropAsBlobImage,
        revokeBlob,
      } = useImageCrop(aspect)

      return (
        <>
          <button
            onClick={() =>
              setCompletedCrop({
                x: 0,
                y: 0,
                unit: "px",
                width: 100,
                height: 100,
              })
            }
          >
            set
          </button>
          <button onClick={() => makeCropAsBlobImage()}>make</button>
          <button onClick={revokeBlob}>revoke</button>
          <img ref={imageRef} src={image} alt="image" />
        </>
      )
    }

    render(<Component />)

    const setButton = screen.getByRole("button", {name: "set"})
    const makeButton = screen.getByRole("button", {name: "make"})
    const revokeButton = screen.getByRole("button", {name: "revoke"})

    fireEvent.click(setButton)
    await waitFor(() => {
      fireEvent.click(makeButton)
    })

    // when
    fireEvent.click(revokeButton)

    // then
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })

  it("'revokeImage'은 image가 없다면 'URL.revokeObjectURL'을 호출하지 않는다.", async () => {
    // given
    const Component = () => {
      const aspect = 1
      const {revokeImage} = useImageCrop(aspect)

      return <button onClick={revokeImage}>revoke</button>
    }

    render(<Component />)

    const revokeButton = screen.getByRole("button", {name: "revoke"})

    // when
    fireEvent.click(revokeButton)

    // then
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
  })

  it("'revokeImage'은 image가 있다면 'URL.revokeObjectURL'을 호출하고 이미지를 초기화한다.", async () => {
    // given
    const Component = ({file}: {file: File}) => {
      const aspect = 1
      const {
        imageRef,
        image,
        convertBlobToDataUrl,
        setCompletedCrop,
        makeCropAsBlobImage,
        revokeImage,
      } = useImageCrop(aspect)

      return (
        <>
          <button onClick={() => convertBlobToDataUrl(file)}>convert</button>
          <button
            onClick={() =>
              setCompletedCrop({
                x: 0,
                y: 0,
                unit: "px",
                width: 100,
                height: 100,
              })
            }
          >
            set
          </button>
          <button onClick={() => makeCropAsBlobImage()}>make</button>
          <button onClick={revokeImage}>revoke</button>
          <img ref={imageRef} src={image} alt="image" />
        </>
      )
    }
    const imageFile = new File([], "text.png", {type: "image/png"})
    render(<Component file={imageFile} />)

    const convertButton = screen.getByRole("button", {name: "convert"})
    const setButton = screen.getByRole("button", {name: "set"})
    const makeButton = screen.getByRole("button", {name: "make"})
    const revokeButton = screen.getByRole("button", {name: "revoke"})

    // when
    await waitFor(() => {
      fireEvent.click(convertButton)
    })

    // then
    const image = screen.getByAltText("image") as HTMLImageElement

    await waitFor(() => {
      expect(image.src).not.toEqual(DEFAULT_IMAGE_SRC)
    })

    // when
    fireEvent.click(setButton)
    await waitFor(() => {
      fireEvent.click(makeButton)
    })
    fireEvent.click(revokeButton)

    // then

    expect(URL.revokeObjectURL).toHaveBeenCalled()
    expect(image.src).toEqual(DEFAULT_IMAGE_SRC)
  })
})
