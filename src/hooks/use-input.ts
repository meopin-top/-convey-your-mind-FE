import {useState, type ChangeEvent} from "react"

type TInputChangeEvent = ChangeEvent<HTMLInputElement>

export default function useInput(
  defaultValue: string = "",
  callback?: (event: TInputChangeEvent) => any
): [string, (event: TInputChangeEvent) => void] {
  const [value, setValue] = useState(defaultValue)

  function handleValue(event: TInputChangeEvent) {
    setValue(event.target.value)
    if (callback) {
      callback(event)
    }
  }

  return [value, handleValue]
}
