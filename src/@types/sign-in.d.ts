export type TTab = "signIn" | "signUp"

export type TRoute = "/my" | `/rolling-paper/edit/${string}`

export type TStore = {
  tab: TTab
  setTab: (tab: TTab) => void
  redirectTo: TRoute
  setRedirectTo: (to: TRoute) => void
}
