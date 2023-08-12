import {calculateRemainingDay} from "@/utils/formatter"

describe("calculateRemainingDay", () => {
  it("비교 시각이 현재 시각보다 먼저면 음수 값을 반환한다.", () => {
    // given, when
    let remainingDay = calculateRemainingDay(
      "Sat Aug 12 2023 21:30:16 GMT+0900",
      "Sat Aug 12 2024 21:30:16 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(-366)

    remainingDay = calculateRemainingDay(
      "Sat Aug 12 2023 21:30:17 GMT+0900",
      "Sat Aug 12 2024 21:30:16 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(-365)
  })

  it("비교 시각이 현재 시각과 같으면 0을 반환한다.", () => {
    // given, when
    const remainingDay = calculateRemainingDay(
      "Sat Aug 12 2023 21:30:16 GMT+0900",
      "Sat Aug 12 2023 21:30:16 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(0)
  })

  it("24 * i시간 이하가 남았으면 i을 반환한다.", () => {
    // given when
    let remainingDay = calculateRemainingDay(
      "Sat Aug 12 2023 21:30:16 GMT+0900",
      "Sat Aug 12 2023 21:30:15 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(1)

    // given, when
    remainingDay = calculateRemainingDay(
      "Sat Aug 13 2023 21:30:14 GMT+0900",
      "Sat Aug 12 2023 21:30:15 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(1)

    remainingDay = calculateRemainingDay(
      "Sat Aug 13 2023 21:30:15 GMT+0900",
      "Sat Aug 12 2023 21:30:15 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(1)

    remainingDay = calculateRemainingDay(
      "Sat Aug 14 2023 21:30:14 GMT+0900",
      "Sat Aug 12 2023 21:30:15 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(2)

    remainingDay = calculateRemainingDay(
      "Sat Aug 14 2023 21:30:15 GMT+0900",
      "Sat Aug 12 2023 21:30:15 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(2)

    remainingDay = calculateRemainingDay(
      "Sat Aug 15 2023 21:30:14 GMT+0900",
      "Sat Aug 12 2023 21:30:15 GMT+0900"
    )

    // then
    expect(remainingDay).toEqual(3)
  })
})
