export type TTab = "signIn" | "signUp"

export type TRoute = "/my" | "/rolling-paper/write"

export type TStore = {
  signUpTab: TTab
  setSignUpTab: (tab: TTab) => void
  redirectTo: TRoute
  setRedirectTo: (to: TRoute) => void
}
