import {calculateDateOffset, isBefore} from "@/utils/date"
import {ONE_DAY} from "@/constants/date"

describe("calculateDateOffset", () => {
  it("n일 뒤의 날짜와 년/월/일이 같아야 한다.", () => {
    // given
    const now = new Date("2023-10-19T12:00:00Z")
    let offset = 5
    let expectedDate = new Date(now.getTime() + offset * ONE_DAY)

    // when
    let result = calculateDateOffset(offset)

    // then
    expect(result.getFullYear()).toEqual(expectedDate.getFullYear())
    expect(result.getMonth()).toEqual(expectedDate.getMonth())
    expect(result.getDate()).toEqual(expectedDate.getDate())

    offset = 10
    expectedDate = new Date(now.getTime() + offset * ONE_DAY)

    // when
    result = calculateDateOffset(offset)

    // then
    expect(result.getFullYear()).toEqual(expectedDate.getFullYear())
    expect(result.getMonth()).toEqual(expectedDate.getMonth())
    expect(result.getDate()).toEqual(expectedDate.getDate())
  })
})

describe("isBefore", () => {
  it("target이 comparable보다 이전 날짜인지를 반환해야 한다.", () => {
    // given
    let targetDate = new Date("2023-10-19T12:00:00Z")
    let comparableDate = new Date("2023-10-20T12:00:00Z")

    // when
    let result = isBefore(targetDate, comparableDate)

    // then
    expect(result).toBeTruthy()

    // given
    targetDate = new Date("2023-10-19T12:00:00Z")
    comparableDate = new Date("2023-10-18T12:00:00Z")

    // when
    result = isBefore(targetDate, comparableDate)

    // then
    expect(result).toBeFalsy()
  })
})