"use client"

import {useContext} from "react"
import {UserIdStore} from "./Context"

const UserId = () => {
  const {userId} = useContext(UserIdStore)

  return (
    <div className="input-wrapper f-center mb-2">
      <span className="input-name">ID</span>
      <span className="input">{userId}</span>
    </div>
  )
}

export default UserId
