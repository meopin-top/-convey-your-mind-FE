import {useRef, type KeyboardEvent} from "react"

export default function useFocus(keys: string[]) {
  const ref = useRef<HTMLElement | null>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    const isSpecificKeyDowned = keys.includes(event.key)
    if (isSpecificKeyDowned && ref?.current){
      ref.current.focus()
    }
  }

  return {ref, onKeyDown: handleKeyDown}
}
