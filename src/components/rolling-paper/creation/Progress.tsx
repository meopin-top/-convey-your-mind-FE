"use client"

import {useContext} from "react"
import {Store} from "@/components/rolling-paper/creation/Context"

type TProps = {
  totalCount: number
}

const Progress = ({totalCount}: TProps) => {
  const doneStep = useContext(Store).doneStep

  const DONE_COUNT = Object.values(doneStep).filter((done) => done).length

  return (
    <div className="progress-bar-wrapper mt-4">
      <div className="progress-bar" role="progressbar">
        <div
          className="progress"
          style={{width: `${(DONE_COUNT * 100) / totalCount}%`}}
        />
      </div>
    </div>
  )
}

export default Progress
