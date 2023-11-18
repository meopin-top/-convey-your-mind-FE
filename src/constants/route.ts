import {OPEN, ALL_PROJECTS, ALL_RECEIVED_ROLLING_PAPERS} from "./query-string"

const ROUTE = {
  MAIN: "/",
  MY_PAGE: "/my",
  MY_PROJECTS: `/my?${OPEN}=${ALL_PROJECTS}`,
  MY_ROLLING_PAPERS: `/my?${OPEN}=${ALL_RECEIVED_ROLLING_PAPERS}`,
  OAUTH_MIDDLEWARE: "/oauth-middleware",
  ACCOUNT_INQUIRY: "/account-inquiry",
  ROLLING_PAPER_CREATION: "/rolling-paper/creation",
  ROLLING_PAPER_EDIT: "/rolling-paper/edit",
  ROLLING_PAPER_VIEW: "/rolling-paper/view",
} as const

export default ROUTE
