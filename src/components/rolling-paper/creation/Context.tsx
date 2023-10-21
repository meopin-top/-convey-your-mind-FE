"use client"

import {useState, createContext, useContext, type ReactNode} from "react"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"
import type {TCreationInformation, TDoneStep, TRollingPaperType} from "@/@types/rolling-paper"

type TProps = {
  children: ReactNode
}

const Store = createContext<{
  doneStep: TDoneStep
  handleDoneStep: (done: boolean, key: TCreationInformation) => void
  setDoneStep: (doneStep: TDoneStep) => void
}>({
  doneStep: {
    WHOM: false,
    PERSONNEL: false,
    TYPE: false,
    DUE_DATE: true,
    SHARING_CODE: false
  },
  handleDoneStep: function () {},
  setDoneStep: function () {}
})

const Provider = ({children}: TProps) => {
  const [doneStep, setDoneStep] = useState<{
    [step in TCreationInformation]: boolean
  }>({
    WHOM: false,
    PERSONNEL: false,
    TYPE: false,
    DUE_DATE: true,
    SHARING_CODE: false
  })

  function handleDoneStep(done: boolean, key: TCreationInformation) {
    const increase = done && !doneStep[key]
    const decrease = !done && doneStep[key]

    if (increase || decrease) {
      setDoneStep({
        ...doneStep,
        [key]: done
      })
    }
  }

  return (
    <Store.Provider value={{
      doneStep,
      handleDoneStep,
      setDoneStep
    }}>
      {children}
    </Store.Provider>
  )
}

const WhomStore = createContext<{
  toWhom: string
  handleToWhom: (event: TInputChangeEvent) => void
}>({
  toWhom: "",
  handleToWhom: function () {}
})

const WhomProvider = ({children}: TProps) => {
  const {handleDoneStep} = useContext(Store)
  const [toWhom, handleToWhom] = useInput("", (event: TInputChangeEvent) => {
    handleDoneStep(event.target.value.length !== 0, "WHOM")
  })

  return (
    <WhomStore.Provider value={{toWhom, handleToWhom}}>
      {children}
    </WhomStore.Provider>
  )
}

const PersonnelStore = createContext<{
  personnel: string
  handlePersonnel: (event: TInputChangeEvent) => void
  setPersonnel: (personnel: string) => void
}>({
  personnel: "",
  handlePersonnel: function () {},
  setPersonnel: function () {}
})

const PersonnelProvider = ({children}: TProps) => {
  const {handleDoneStep} = useContext(Store)
  const [personnel, handlePersonnel, setPersonnel] = useInput(
    "",
    (event: TInputChangeEvent) => {
      handleDoneStep(event.target.value.length !== 0, "PERSONNEL")
    }
  )

  return (
    <PersonnelStore.Provider value={{personnel, handlePersonnel, setPersonnel}}>
      {children}
    </PersonnelStore.Provider>
  )
}

const TypeStore = createContext<{
  type: TRollingPaperType | null
  handleType: (type: TRollingPaperType) => void
}>({
  type: null,
  handleType: function () {}
})

const TypeProvider = ({children}: TProps) => {
  const [type, setType] = useState<TRollingPaperType | null>(null)

  const {handleDoneStep} = useContext(Store)

  function handleType(type: TRollingPaperType) {
    setType(type)
    console.log(type)
    handleDoneStep(true, "TYPE")
  }

  return (
    <TypeStore.Provider value={{type, handleType}}>
      {children}
    </TypeStore.Provider>
  )
}

const DDayStore = createContext<{
  dDay: number
  handleDDay: (dDay: number) => void
}>({
  dDay: 100,
  handleDDay: function () {}
})

const DDayProvider = ({children}: TProps) => {
  const [dDay, setDDay] = useState<number>(100)

  const {handleDoneStep} = useContext(Store)

  function handleDDay(dDay: number) {
    setDDay(dDay)
    handleDoneStep(dDay !== 0, "DUE_DATE")
  }

  return (
    <DDayStore.Provider value={{dDay, handleDDay}}>
      {children}
    </DDayStore.Provider>
  )
}

const SharingCodeStore = createContext<{
  sharingCode: string
  handleSharingCode: (event: TInputChangeEvent) => void
}>({
  sharingCode: "",
  handleSharingCode: function () {}
})

const SharingCodeProvider = ({children}: TProps) => {
  const {handleDoneStep} = useContext(Store)
  const [sharingCode, handleSharingCode] = useInput(
    "",
    (event: TInputChangeEvent) => {
      handleDoneStep(event.target.value.length !== 0, "SHARING_CODE")
    }
  )

  return (
    <SharingCodeStore.Provider value={{sharingCode, handleSharingCode}}>
      {children}
    </SharingCodeStore.Provider>
  )
}

export {
  Store,
  Provider,
  WhomStore,
  WhomProvider,
  PersonnelStore,
  PersonnelProvider,
  TypeStore,
  TypeProvider,
  DDayStore,
  DDayProvider,
  SharingCodeStore,
  SharingCodeProvider
}
