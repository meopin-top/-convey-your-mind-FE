export const OPEN = "open"

export const ALL_PROJECTS = "all-projects"

export const ALL_RECEIVED_ROLLING_PAPERS = "all-received-rolling-papers"

export const ROUTE = {
  MAIN: "/",
  MY_PAGE: "/my",
  MY_SETTING: "/my/setting",
  MY_PROJECTS: `/my?${OPEN}=${ALL_PROJECTS}`,
  MY_ROLLING_PAPERS: `/my?${OPEN}=${ALL_RECEIVED_ROLLING_PAPERS}`,
  OAUTH_MIDDLEWARE: "/oauth-middleware",
  ACCOUNT_INQUIRY: "/account-inquiry",
  ROLLING_PAPER_CREATION: "/rolling-paper/creation",
  ROLLING_PAPER_EDIT: "/rolling-paper/edit",
  ROLLING_PAPER_VIEW: "/rolling-paper/view",
} as const

export const DOMAIN = "http://34.64.92.123" // TODO: 도메인 구입 후 변경
