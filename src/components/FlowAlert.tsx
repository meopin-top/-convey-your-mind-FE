import type {ReactNode} from "react"
import Alert from "./Alert"

type TProps = {
  isAlerting: boolean
  blur?: boolean
  title?: string
  content?: string | JSX.Element
  defaultButton?: ReactNode
  onClose: () => void
  additionalButton?: ReactNode
  onClick?: () => void
}

const FlowAlert = ({
  isAlerting,
  blur,
  title,
  content,
  defaultButton = "확인",
  onClose,
  additionalButton,
  onClick,
}: TProps) => {
  return (
    <Alert isAlerting={isAlerting} blur={blur} style={{padding: "12px"}}>
      {title && <Alert.Title title={title} style={{marginBottom: "20px"}} />}
      {content && (
        <Alert.Content
          style={{
            width: "100%",
            margin: "10px 0",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {content}
        </Alert.Content>
      )}
      <Alert.ButtonWrapper style={{height: "36px", marginTop: "20px"}}>
        <Alert.Button
          onClick={onClose}
          style={{width: `${additionalButton ? "120px" : "100%"}`}}
          type="dark-4"
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
