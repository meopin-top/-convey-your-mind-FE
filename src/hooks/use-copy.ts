type TReturn = {
  copy: (text: string) => Promise<void>
}

export default function useCopy(): TReturn {
  async function copyWithClipboard(text: string) {
    await navigator.clipboard.writeText(text)
  }

  function copyWithExecCommand(text: string) {
    const temporaryElement = document.createElement("textarea")
    temporaryElement.value = text
    temporaryElement.style.opacity = "0"

    document.body.appendChild(temporaryElement)

    temporaryElement.select()
    document.execCommand("copy")

    document.body.removeChild(temporaryElement)
  }

  async function copy(text: string): Promise<void> {
    const isClipboardSupported = Boolean(navigator?.clipboard)

    isClipboardSupported
      ? await copyWithClipboard(text)
      : copyWithExecCommand(text)
  }

  return {copy}
}