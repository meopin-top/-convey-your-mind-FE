import type {ComponentType} from "react"

type TProps = {
  components: ComponentType<any>[]
  children: JSX.Element
}

const Reducer = ({components, children}: TProps) => {
  if (components.length === 0) {
    return <>{children}</>
  }

  return components.reduceRight(
    (previousComponent, Component) =>
      <Component>
        {previousComponent}
      </Component>,
    children
  )
}

export default Reducer