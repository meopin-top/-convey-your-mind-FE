export type TProps = {
  children: React.ReactNode
  recommendationText?: string
  isReady?: boolean
  type?: string
  isSelected?: boolean
}

const Type = ({
  children,
  recommendationText,
  isReady = true,
  type,
  isSelected,
}: TProps) => {
  return (
    <div
      className={`${
        isSelected ? "active" : ""
      } type f-center shadow-md radius-md`}
      data-type={type}
    >
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
