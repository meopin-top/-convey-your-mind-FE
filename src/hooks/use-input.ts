import {useState, type ChangeEvent} from "react"

export type TInputChangeEvent = ChangeEvent<HTMLInputElement>

export type TTextareaChangeEvent = ChangeEvent<HTMLTextAreaElement>

export default function useInput(
  defaultValue: string = "",
  callback?: (event: TInputChangeEvent | TTextareaChangeEvent) => any
): [
  string,
  (event: TInputChangeEvent | TTextareaChangeEvent) => void,
  (value: string) => void
] {
  const [value, setValue] = useState(defaultValue)

  function handleValue(event: TInputChangeEvent | TTextareaChangeEvent) {
    setValue(event.target.value)
    if (callback) {
      callback(event)
    }
  }

  return [value, handleValue, setValue]
}
