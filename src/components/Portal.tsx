import type {ReactNode} from "react"
import {createPortal} from "react-dom"
import usePortal from "@/hooks/use-portal"

type TProps = {
  render: (...args: any) => ReactNode
}

const Portal = ({render}: TProps) => {
  const portal = usePortal()

  return portal ? createPortal(render(), portal) : null
}

export default Portal
