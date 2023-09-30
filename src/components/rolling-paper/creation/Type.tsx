export type TProps = {
  children: React.ReactNode
  recommendationText?: string
  isReady?: boolean
}

const Type = ({children, recommendationText, isReady = true}: TProps) => {
  return (
    <div className="type f-center shadow-md radius-md">
      {children}
      {recommendationText && (
        <div className="recommendation f-center pl-1 pr-1">
          {recommendationText}
        </div>
      )}
      {!isReady && <div className="coming-soon f-center">Coming soon</div>}
    </div>
  )
}

export default Type
