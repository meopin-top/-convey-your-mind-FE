"use client"

import Redirecting from "./Redirecting"
import {useNeedLoggedIn, useNeedNotLoggedIn} from "@/hooks/use-logged-in"

export const NeedLoggedIn = () => {
  const isRedirecting = useNeedLoggedIn()

  return <Redirecting isRedirecting={isRedirecting} />
}

export const NeedNotLoggedIn = () => {
  const isRedirecting = useNeedNotLoggedIn()

  return <Redirecting isRedirecting={isRedirecting} />
}
