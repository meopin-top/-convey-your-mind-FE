type TGetLastPage = {
  totalCount: number
  countPerPage: number
}

type TIsValidPage = {
  page: number
} & TGetLastPage

type TPageHandler = {
  getFirstPage: () => number
  getLastPage: ({..._arguments}: TGetLastPage) => number
  isValidPage: ({..._arguments}: TIsValidPage) => boolean
}

export default function usePagination(): TPageHandler {
  function getFirstPage() {
    return 1
  }

  function getLastPage({
    totalCount,
    countPerPage,
  }: {
    totalCount: number
    countPerPage: number
  }) {
    if (!totalCount) {
      return getFirstPage()
    }

    return Math.ceil(totalCount / countPerPage)
  }

  function isValidPage({
    page,
    totalCount,
    countPerPage,
  }: {
    page: number
    totalCount: number
    countPerPage: number
  }) {
    const firstPage = getFirstPage()
    const lastPage = getLastPage({totalCount, countPerPage})

    return firstPage <= page && page <= lastPage
  }

  return {
    getFirstPage,
    getLastPage,
    isValidPage,
  }
}
