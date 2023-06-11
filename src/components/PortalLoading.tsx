import {createPortal} from "react-dom"
import usePortal from "@/hooks/use-portal"
import Loading, {type TProps} from "./Loading"

const PortalLoading = ({...props}: TProps) => {
  const portal = usePortal()

  return portal ? createPortal(<Loading {...props} />, portal) : null
}

export default PortalLoading
