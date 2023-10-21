"use client"

import {useState, type ChangeEvent} from "react"

// 참고: https://mieumje.tistory.com/164

const Home = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const onUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 0) {
      return
    }

    const file = (event.target.files as FileList)[0]
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => {
      setPreviewImage((reader.result as string) || null)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*;capture=camera"
        onChange={onUploadImage}
      />
      {previewImage && <img width={"100%"} src={previewImage} alt="" />}
    </div>
  )
}

export default Home
