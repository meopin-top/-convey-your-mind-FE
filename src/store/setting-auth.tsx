"use client"

import {useState, createContext, type ReactNode} from "react"

const Store = createContext<{
  checked: boolean
  setChecked: (checked: boolean) => void
}>({
  checked: false,
  setChecked: function () {},
})

export const Provider = ({children}: {children: ReactNode}) => {
  const [checked, setChecked] = useState(false)

  return (
    <Store.Provider value={{checked, setChecked}}>
      {children}
    </Store.Provider>
  )
}

export default Store
