"use client"

import {useState, createContext, type ReactNode} from "react"
import type {TStore, TTab} from "@/@types/sign-up-tab"

const Store = createContext<TStore>({
  signUpTab: "signIn",
  setSignUpTab: function () {},
})

export const Provider = ({children}: {children: ReactNode}) => {
  const [signUpTab, setSignUpTab] = useState<TTab>("signIn")

  return (
    <Store.Provider value={{signUpTab, setSignUpTab}}>
      {children}
    </Store.Provider>
  )
}

export default Store
