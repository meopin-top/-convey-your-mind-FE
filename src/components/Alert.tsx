"use client"

import {TColor} from "@/@types/color"
import {type MouseEvent, type HTMLAttributes, type ReactNode} from "react"

type TProps = {
  isAlerting: boolean
  blur?: boolean
  isUseCustomButton?: boolean
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

const Alert = ({isAlerting, blur = false, children, ...props}: TProps) => {
  return (
    <>
      {isAlerting && (
        <div className={`alert f-center ${blur ? "blur" : ""}`}>
          <div className="wrapper shadow-lg" {...props}>
            {children}
          </div>
        </div>
      )}
    </>
  )
}

const Title = ({
  title = "알림",
  ...props
}: {
  title?: string
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="title f-center" {...props}>
      <h4>{title}</h4>
    </div>
  )
}

const Content = ({
  children,
  ...props
}: {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="content" {...props}>
      {children}
    </div>
  )
}

const ButtonWrapper = ({
  children,
  ...props
}: {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="button-wrapper f-center" {...props}>
      {children}
    </div>
  )
}

const Button = ({
  children = "확인",
  onClick,
  type = "normal",
  ...props
}: {
  children: ReactNode
  onClick: (event: MouseEvent<HTMLButtonElement>) => any
  type?: TColor
} & HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`radius-md shadow-sm ${type}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

Alert.Title = Title
Alert.Content = Content
Alert.ButtonWrapper = ButtonWrapper
Alert.Button = Button

export default Alert
