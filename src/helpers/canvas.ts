import type {TPosition, TRollingPaperContentSize} from "@/@types/rolling-paper"

type TTextContent = {
  sender: string
  text: string
}

type TImageContent = {
  sender: string
  image: string
}

class Item {
  sizable: boolean
  draggable: boolean
  dragOffsetPosition: TPosition
  sender: HTMLSpanElement
  contentPreview: HTMLDivElement
  content: TTextContent | TImageContent
  position: TPosition

  static INITIAL_POSITION: TPosition = {
    pageX: 0,
    pageY: 0,
  }

  constructor({
    content,
    position,
  }: {
    content: TTextContent | TImageContent
    position: TPosition
  }) {
    this.sizable = false
    this.draggable = false
    this.dragOffsetPosition = Item.INITIAL_POSITION
    this.content = content
    this.position = position
    this.sender = document.createElement("span")
    this.contentPreview = document.createElement("div")
  }

  setStyle(): void {
    this.contentPreview.style.top = `${this.position.pageY}px`
    this.contentPreview.style.left = `${this.position.pageX}px`
    this.contentPreview.classList.add("paper-content")
    this.contentPreview.classList.add("edit")

    this.sender.classList.add("sender")
    this.sender.classList.add("pt-1")
    this.sender.classList.add("pr-1")
    this.sender.classList.add("pb-1")
    this.sender.classList.add("pl-1")
  }

  setInner(): void {
    this.sender.innerHTML = this.content.sender
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setEvent(...args: any): void {}

  positionSender(): void {
    this.sender.style.left = `${
      this.contentPreview.getBoundingClientRect().width / 2 -
      this.sender.getBoundingClientRect().width / 2
    }px`
  }

  show(wrapper: HTMLDivElement): void {
    this.contentPreview.appendChild(this.sender)
    wrapper.appendChild(this.contentPreview)
  }

  getContentPreview(): null | HTMLDivElement {
    return null
  }
}

interface Preview {
  confirmation: HTMLButtonElement
  close: HTMLButtonElement
  resize: HTMLButtonElement
  confirmationText: string
  closeText: string
  setPreviewStyle: () => void
  setPreviewInner: () => void
  setEvent: ({
    onClickConfirmation,
    onClickClose,
  }: {
    onClickConfirmation: () => void
    onClickClose: () => void
  }) => void // drag 이벤트를 쓸 필요가 없음: https://ko.javascript.info/mouse-drag-and-drop
  showPreview: () => void
}

interface Text {
  setTextInner: () => void
}

interface Image {
  setImageInner: () => void // contentPreview 드래그 이벤트를 간단히 구현하기 위해 img 엘리먼트를 생성하지 않음
}

export class TextPreviewItem extends Item implements Text, Preview {
  confirmation: HTMLButtonElement
  close: HTMLButtonElement
  resize: HTMLButtonElement
  content!: TTextContent
  confirmationText: string
  closeText: string

  constructor({
    content,
    position,
  }: {
    content: TTextContent
    position: TPosition
  }) {
    super({content, position})

    this.confirmation = document.createElement("button")
    this.close = document.createElement("button")
    this.resize = document.createElement("button")
    this.confirmationText = "V"
    this.closeText = "X"
  }

  setStyle(): void {
    this.setPreviewStyle()
    super.setStyle()

    this.contentPreview.style.width = `${(visualViewport?.width ?? 100) / 4}px`
    this.contentPreview.style.height = "unset"
    this.contentPreview.classList.add("pt-2")
    this.contentPreview.classList.add("pr-2")
    this.contentPreview.classList.add("pb-4")
    this.contentPreview.classList.add("pl-2")
  }

  setPreviewStyle(): void {
    this.confirmation.classList.add("confirmation")
    this.close.classList.add("close")
    this.resize.classList.add("size")
  }

  setInner(): void {
    this.setPreviewInner()
    this.setTextInner()
    super.setInner()
  }

  setPreviewInner(): void {
    this.confirmation.innerText = this.confirmationText
    this.close.innerText = this.closeText
  }

  setTextInner(): void {
    this.contentPreview.innerText = this.content.text
  }

  setEvent({
    onClickConfirmation,
    onClickClose,
  }: {
    onClickConfirmation: () => void
    onClickClose: () => void
  }): void {
    this.confirmation.addEventListener("click", onClickConfirmation)
    this.close.addEventListener("click", onClickClose)
    this.resize.addEventListener("mousedown", ({target}) => {
      if (target === this.resize) {
        this.sizable = true
        this.dragOffsetPosition = {
          pageY: Number(
            this.contentPreview.style.top.slice(
              0,
              this.contentPreview.style.top.length - 2
            )
          ),
          pageX: Number(
            this.contentPreview.style.left.slice(
              0,
              this.contentPreview.style.left.length - 2
            )
          ),
        }
      }
    })
    document.addEventListener("mousemove", ({pageX, pageY}) => {
      if (this.sizable) {
        this.contentPreview.style.height = `${
          pageY - this.dragOffsetPosition.pageY
        }px`
        this.contentPreview.style.width = `${
          pageX - this.dragOffsetPosition.pageX
        }px`
        this.positionSender()
      }
    })
    this.resize.addEventListener("mouseup", () => {
      if (this.sizable) {
        this.sizable = false
        this.dragOffsetPosition = Item.INITIAL_POSITION
      }
    })

    this.contentPreview.addEventListener(
      "mousedown",
      ({target, offsetX, offsetY}) => {
        if (target === this.contentPreview) {
          this.draggable = true
          this.dragOffsetPosition = {
            pageY: offsetY,
            pageX: offsetX,
          }
        }
      }
    )
    document.addEventListener("mousemove", ({pageX, pageY}) => {
      if (this.draggable) {
        this.contentPreview.style.top = `${
          pageY - this.dragOffsetPosition.pageY
        }px`
        this.contentPreview.style.left = `${
          pageX - this.dragOffsetPosition.pageX
        }px`
      }
    })
    this.contentPreview.addEventListener("mouseup", () => {
      if (this.draggable) {
        this.draggable = false
        this.dragOffsetPosition = Item.INITIAL_POSITION
      }
    })
  }

  show(wrapper: HTMLDivElement) {
    this.showPreview()
    super.show(wrapper)
  }

  showPreview(): void {
    this.contentPreview.appendChild(this.confirmation)
    this.contentPreview.appendChild(this.close)
    this.contentPreview.appendChild(this.resize)
  }

  getContentPreview() {
    return this.contentPreview
  }
}

export class ImagePreviewItem extends Item implements Image, Preview {
  confirmation: HTMLButtonElement
  close: HTMLButtonElement
  resize: HTMLButtonElement
  content!: TImageContent
  size: TRollingPaperContentSize
  confirmationText: string
  closeText: string

  constructor({
    content,
    position,
    size,
  }: {
    content: TImageContent
    position: TPosition
    size: TRollingPaperContentSize
  }) {
    super({content, position})

    this.size = size
    this.confirmation = document.createElement("button")
    this.close = document.createElement("button")
    this.resize = document.createElement("button")
    this.confirmationText = "V"
    this.closeText = "X"
  }

  setStyle(): void {
    this.setPreviewStyle()
    super.setStyle()

    this.contentPreview.style.width = `${this.size.width}px`
    this.contentPreview.style.height = `${this.size.height}px`
  }

  setPreviewStyle() {
    this.confirmation.classList.add("confirmation")
    this.close.classList.add("close")
    this.resize.classList.add("size")
  }

  setInner(): void {
    this.setPreviewInner()
    this.setImageInner()
    super.setInner()
  }

  setPreviewInner(): void {
    this.confirmation.innerText = this.confirmationText
    this.close.innerText = this.closeText
  }

  setImageInner(): void {
    this.contentPreview.style.backgroundImage = `url("${this.content.image}")`
  }

  setEvent({
    onClickConfirmation,
    onClickClose,
  }: {
    onClickConfirmation: () => void
    onClickClose: () => void
  }): void {
    this.confirmation.addEventListener("click", onClickConfirmation)
    this.close.addEventListener("click", onClickClose)
    this.resize.addEventListener("mousedown", ({target}) => {
      if (target === this.resize) {
        this.sizable = true
        this.dragOffsetPosition = {
          pageY: Number(
            this.contentPreview.style.top.slice(
              0,
              this.contentPreview.style.top.length - 2
            )
          ),
          pageX: Number(
            this.contentPreview.style.left.slice(
              0,
              this.contentPreview.style.left.length - 2
            )
          ),
        }
      }
    })
    document.addEventListener("mousemove", ({pageX, pageY}) => {
      if (this.sizable) {
        this.contentPreview.style.height = `${
          pageY - this.dragOffsetPosition.pageY
        }px`
        this.contentPreview.style.width = `${
          pageX - this.dragOffsetPosition.pageX
        }px`
        this.positionSender()
      }
    })
    this.resize.addEventListener("mouseup", () => {
      if (this.sizable) {
        this.sizable = false
        this.dragOffsetPosition = Item.INITIAL_POSITION
      }
    })

    this.contentPreview.addEventListener(
      "mousedown",
      ({target, offsetX, offsetY}) => {
        if (target === this.contentPreview) {
          this.draggable = true
          this.dragOffsetPosition = {
            pageY: offsetY,
            pageX: offsetX,
          }
        }
      }
    )
    document.addEventListener("mousemove", ({pageX, pageY}) => {
      if (this.draggable) {
        this.contentPreview.style.top = `${
          pageY - this.dragOffsetPosition.pageY
        }px`
        this.contentPreview.style.left = `${
          pageX - this.dragOffsetPosition.pageX
        }px`
      }
    })
    this.contentPreview.addEventListener("mouseup", () => {
      if (this.draggable) {
        this.draggable = false
        this.dragOffsetPosition = Item.INITIAL_POSITION
      }
    })
  }

  show(wrapper: HTMLDivElement) {
    this.showPreview()
    super.show(wrapper)
  }

  showPreview(): void {
    this.contentPreview.appendChild(this.confirmation)
    this.contentPreview.appendChild(this.close)
    this.contentPreview.appendChild(this.resize)
  }

  getContentPreview() {
    return this.contentPreview
  }
}

export class TextItem extends Item implements Text {
  content!: TTextContent
  size: TRollingPaperContentSize

  constructor({
    content,
    position,
    size,
  }: {
    content: TTextContent
    position: TPosition
    size: TRollingPaperContentSize
  }) {
    super({content, position})

    this.size = size
  }

  setStyle(): void {
    super.setStyle()

    this.contentPreview.style.width = `${this.size.width}px`
    this.contentPreview.style.height = `${this.size.height}px`
    this.contentPreview.classList.add("pt-2")
    this.contentPreview.classList.add("pr-2")
    this.contentPreview.classList.add("pb-4")
    this.contentPreview.classList.add("pl-2")
  }

  setInner(): void {
    this.setTextInner()
    super.setInner()
  }

  setTextInner(): void {
    this.contentPreview.innerText = this.content.text
  }
}

export class ImageItem extends Item implements Image {
  content!: TImageContent
  size: TRollingPaperContentSize

  constructor({
    content,
    position,
    size,
  }: {
    content: TImageContent
    position: TPosition
    size: TRollingPaperContentSize
  }) {
    super({content, position})

    this.size = size
  }

  setStyle(): void {
    super.setStyle()

    this.contentPreview.style.width = `${this.size.width}px`
    this.contentPreview.style.height = `${this.size.height}px`
  }

  setInner(): void {
    this.setImageInner()
    super.setInner()
  }

  setImageInner(): void {
    this.contentPreview.style.backgroundImage = `url("${this.content.image}")`
  }
}

export default Item
