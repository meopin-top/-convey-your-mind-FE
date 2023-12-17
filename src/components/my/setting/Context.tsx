"use client"

import {useState, createContext, type ReactNode} from "react"
import useInput, {type TInputChangeEvent} from "@/hooks/use-input"

type TProps = {
  children: ReactNode
}

type TProfile = Blob | string

const UserIdStore = createContext<{
  userId: string
  setUserId: (id: string) => void
}>({
  userId: "",
  setUserId: function () {},
})

const UserIdProvider = ({children}: TProps) => {
  const [userId, setUserId] = useState("")

  return (
    <UserIdStore.Provider value={{userId, setUserId}}>
      {children}
    </UserIdStore.Provider>
  )
}

const PasswordStore = createContext<{
  password: string
  handlePassword: (event: TInputChangeEvent) => void
  passwordConfirm: string
  handlePasswordConfirm: (event: TInputChangeEvent) => void
}>({
  password: "",
  handlePassword: function () {},
  passwordConfirm: "",
  handlePasswordConfirm: function () {},
})

const PasswordProvider = ({children}: TProps) => {
  const [password, handlePassword] = useInput("")
  const [passwordConfirm, handlePasswordConfirm] = useInput("")

  return (
    <PasswordStore.Provider
      value={{password, handlePassword, passwordConfirm, handlePasswordConfirm}}
    >
      {children}
    </PasswordStore.Provider>
  )
}

const ProfileStore = createContext<{
  profile: TProfile
  setProfile: (profile: TProfile) => void
}>({
  profile: "",
  setProfile: function () {},
})

const ProfileProvider = ({children}: TProps) => {
  const [profile, setProfile] = useState<TProfile>("")

  return (
    <ProfileStore.Provider value={{profile, setProfile}}>
      {children}
    </ProfileStore.Provider>
  )
}

const NicknameStore = createContext<{
  nickname: string
  handleNickname: (event: TInputChangeEvent) => void
  setNickname: (nickname: string) => void
}>({
  nickname: "",
  handleNickname: function () {},
  setNickname: function () {},
})

const NicknameProvider = ({children}: TProps) => {
  const [nickname, handleNickname, setNickname] = useInput("")

  return (
    <NicknameStore.Provider value={{nickname, handleNickname, setNickname}}>
      {children}
    </NicknameStore.Provider>
  )
}

const EmailStore = createContext<{
  email: string
  handleEmail: (event: TInputChangeEvent) => void
  setEmail: (email: string) => void
}>({email: "", handleEmail: function () {}, setEmail: function () {}})

const EmailProvider = ({children}: TProps) => {
  const [email, handleEmail, setEmail] = useInput("")

  return (
    <EmailStore.Provider value={{email, handleEmail, setEmail}}>
      {children}
    </EmailStore.Provider>
  )
}

export {
  UserIdStore,
  UserIdProvider,
  PasswordStore,
  PasswordProvider,
  ProfileStore,
  ProfileProvider,
  NicknameStore,
  NicknameProvider,
  EmailStore,
  EmailProvider,
}
