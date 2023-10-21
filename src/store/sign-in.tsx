"use client"

import {useState, createContext, type ReactNode} from "react"
import ROUTE from "@/constants/route"
import type {TStore, TTab, TRoute} from "@/@types/sign-in"

const Store = createContext<TStore>({
  tab: "signIn",
  setTab: function () {},
  redirectTo: ROUTE.MY_PAGE,
  setRedirectTo: function () {},
})

export const Provider = ({children}: {children: ReactNode}) => {
  const [tab, setTab] = useState<TTab>("signIn")
  const [redirectTo, setRedirectTo] = useState<TRoute>(ROUTE.MY_PAGE)

  return (
    <Store.Provider value={{tab, setTab, redirectTo, setRedirectTo}}>
      {children}
    </Store.Provider>
  )
}

export default Store
