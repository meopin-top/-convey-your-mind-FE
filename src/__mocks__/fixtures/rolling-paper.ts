import type {
  TRollingPaperTextContent,
  TRollingPaperImageContent,
} from "@/@types/rolling-paper"

export const senderTextContent: Omit<TRollingPaperTextContent, "content_id"> = {
  user_id: "user",
  content_type: "text",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  text: {
    text: "text",
    sender: "sender",
  },
}

export const receiverTextContent: TRollingPaperTextContent = {
  user_id: "user",
  content_id: "content",
  content_type: "text",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  text: {
    text: "text",
    sender: "sender",
  },
}

export const senderImageContent: Omit<TRollingPaperImageContent, "content_id"> =
  {
    user_id: "user",
    content_type: "image",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    image_url:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  }

export const receiverImageContent: TRollingPaperImageContent = {
  user_id: "user",
  content_id: "content",
  content_type: "image",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  image_url:
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
}
