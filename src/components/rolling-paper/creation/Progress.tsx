type TProps = {
  totalCount: number
  doneCount: number
}

const Progress = ({totalCount, doneCount}: TProps) => {
  return (
    <div className="progress-bar-wrapper mt-4">
      <div className="progress-bar" role="progressbar">
        <div
          className="progress"
          style={{width: `${(doneCount * 100) / totalCount}%`}}
        />
      </div>
    </div>
  )
}

export default Progress
