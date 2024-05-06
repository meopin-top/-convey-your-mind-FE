"use client"

import {createContext, type ReactNode} from "react"
import useSizeKeeper from "@/hooks/use-size-keeper"
import type {TViewport} from "@/@types/viewport"

const Store = createContext<TViewport>({
  sizes: [],
  position: {
    top: 0,
    left: 0,
    width: 0,
  },
})

const ININITAL_SIZES = {
  logo: 32,
  menu: 24,
  padding: 20,
}

export const Provider = ({children}: {children: ReactNode}) => {
  const {sizes, position} = useSizeKeeper([
    ININITAL_SIZES.logo,
    ININITAL_SIZES.menu,
    ININITAL_SIZES.padding,
  ])

  return <Store.Provider value={{sizes, position}}>{children}</Store.Provider>
}

export default Store
