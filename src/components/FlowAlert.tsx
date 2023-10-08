"use client"

import {useEffect, useRef, type ReactNode, type KeyboardEvent} from "react"
import Alert from "./Alert"

type TProps = {
  isAlerting: boolean
  isControllingKeyInput?: boolean
  blur?: boolean
  title?: string
  content?: ReactNode
  defaultButton?: ReactNode
  onClose: () => void
  additionalButton?: ReactNode
  onClick?: () => void
}

const FlowAlert = ({
  isAlerting,
  isControllingKeyInput = true,
  blur,
  title,
  content,
  defaultButton = "확인",
  onClose,
  additionalButton,
  onClick,
}: TProps) => {
  const wrapper = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    wrapper.current?.focus()
  }, [isAlerting])

  function controlKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isControllingKeyInput) {
      return
    }

    event.stopPropagation()

    const isCloseKeyDowned = event.key === "Enter" || event.key === "Escape"
    if (isCloseKeyDowned) {
      onClose()
    }
  }

  return (
    <Alert
      isAlerting={isAlerting}
      blur={blur}
      style={{padding: "12px"}}
      onKeyDownCapture={controlKeyDown}
      divRef={wrapper}
      tabIndex={0}
    >
      {title && <Alert.Title title={title} style={{marginBottom: "20px"}} />}
      {content && (
        <Alert.Content
          style={{
            width: "100%",
            margin: "10px 0 20px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {content}
        </Alert.Content>
      )}
      <Alert.ButtonWrapper style={{height: "36px"}}>
        <Alert.Button
          onClick={onClose}
          style={{width: `${additionalButton ? "120px" : "100%"}`}}
          type={additionalButton ? "dark-4" : "fill-dark-4"}
        >
          {defaultButton}
        </Alert.Button>
        {additionalButton && (
          <Alert.Button
            onClick={onClick!}
            style={{width: "120px"}}
            type="fill-dark-4"
          >
            {additionalButton}
          </Alert.Button>
        )}
      </Alert.ButtonWrapper>
    </Alert>
  )
}

export default FlowAlert
