import {OPEN, ALL_PROJECTS, ALL_RECEIVED_ROLLING_PAPERS} from "./query-string"

const ROUTE = {
  MAIN: "/",
  MY_PAGE: "/my",
  MY_PROJECTS: `/my?${OPEN}=${ALL_PROJECTS}`,
  MY_ROLLING_PAPERS: `/my?${OPEN}=${ALL_RECEIVED_ROLLING_PAPERS}`,
  OAUTH_MIDDLEWARE: "/oauth-middleware",
  ACCOUNT_INQUIRY: "/account-inquiry",
} as const

export default ROUTE
