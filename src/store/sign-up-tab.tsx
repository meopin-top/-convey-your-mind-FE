"use client"

import {useState, createContext, type ReactNode} from "react"
import ROUTE from "@/constants/route"
import type {TStore, TTab, TRoute} from "@/@types/sign-up-tab"

const Store = createContext<TStore>({
  signUpTab: "signIn",
  setSignUpTab: function () {},
  redirectTo: ROUTE.MY_PAGE,
  setRedirectTo: function () {},
})

export const Provider = ({children}: {children: ReactNode}) => {
  const [signUpTab, setSignUpTab] = useState<TTab>("signIn")
  const [redirectTo, setRedirectTo] = useState<TRoute>(ROUTE.MY_PAGE)

  return (
    <Store.Provider
      value={{signUpTab, setSignUpTab, redirectTo, setRedirectTo}}
    >
      {children}
    </Store.Provider>
  )
}

export default Store
