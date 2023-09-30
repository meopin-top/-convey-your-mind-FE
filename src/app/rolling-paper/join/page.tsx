"use client"

import {useNeedLoggedIn} from "@/hooks/use-logged-in"

const RollingPaperJoin = () => {
  useNeedLoggedIn()

  return <div>test</div>
}

export default RollingPaperJoin
