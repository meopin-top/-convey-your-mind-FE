"use client"

import {useState, useEffect, useRef, type SyntheticEvent} from "react"
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

// get file input -> read as data url -> initialize crop -> initialize crop mask
export default function useImageCrop(aspect: number) {
  const [image, setImage] = useState("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const imageRef = useRef<HTMLImageElement>(null)
  const cropRef = useRef<ReactCrop>(null)
  const blobRef = useRef("")

  useEffect(() => {
    return () => {
      revokeBlob()
      revokeImage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (cropRef.current) {
      const cropMask = cropRef.current.componentRef.current?.querySelector(
        ".ReactCrop__crop-mask"
      )

      const realImageHeight =
        cropRef.current.componentRef.current?.getBoundingClientRect().height

      if (realImageHeight) {
        cropMask?.setAttribute("height", realImageHeight.toString())
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageRef.current])

  function convertBlobToDataUrl(file: File) {
    const reader = new FileReader()
    reader.addEventListener("load", () =>
      setImage(reader.result?.toString() || "")
    )
    reader.readAsDataURL(file)
  }

  function initializeAspect(event: SyntheticEvent<HTMLImageElement>) {
    const {width, height} = event.currentTarget

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "px",
          width,
          height,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    )
    setCrop(initialCrop)
    setCompletedCrop(initialCrop)
  }

  async function makeCropAsBlobImage() {
    if (!completedCrop || !imageRef.current) {
      throw new Error("completed crop 없음")
    }

    const offscreen = new OffscreenCanvas(
      completedCrop.width,
      completedCrop.height
    )
    const ctx = offscreen.getContext("2d")
    if (!ctx) {
      throw new Error("canvas 2d 없음")
    }

    const scaleX = imageRef.current.naturalWidth / imageRef.current.width
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height
    const targetSize = 216

    offscreen.width = targetSize
    offscreen.height = targetSize

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetSize,
      targetSize
    )

    const blob = await offscreen.convertToBlob({
      type: "image/webp",
    })

    revokeBlob()
    const url = URL.createObjectURL(blob)
    blobRef.current = url

    return url
  }

  function revokeBlob() {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current)
    }
  }

  function revokeImage() {
    if (image) {
      URL.revokeObjectURL(image)
    }
    setImage("")
  }

  return {
    image,
    imageRef,
    crop,
    cropRef,
    completedCrop,
    setCrop,
    setCompletedCrop,
    convertBlobToDataUrl,
    initializeAspect,
    makeCropAsBlobImage,
    revokeBlob,
    revokeImage,
  }
}
