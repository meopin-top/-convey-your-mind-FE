export type TTab = "signIn" | "signUp"

export type TStore = {
  signUpTab: TTab
  setSignUpTab: (tab: TTab) => void
}
