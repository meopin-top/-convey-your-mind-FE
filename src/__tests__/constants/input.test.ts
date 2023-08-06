import {VALIDATOR} from "@/constants/input"
import {
  invalidUserIds,
  validUserIds,
  invalidPasswords,
  validPasswords,
  invalidEmails,
  validEmails,
} from "@/__mocks__/fixtures/input"

describe("VALIDATOR", () => {
  it("유효하지 않은 유저 아이디는 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    // given, when

    invalidUserIds.forEach((userId) => {
      // then
      expect(VALIDATOR.USER_ID.test(userId)).toBeFalsy()
    })
  })

  it("유효한 유저 아이디는 정규 표현식 테스트에 통과해야 한다.", () => {
    validUserIds.forEach((userId) => {
      expect(VALIDATOR.USER_ID.test(userId)).toBeTruthy()
    })
  })

  it("유효하지 않은 유저 비밀번호는 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    invalidPasswords.forEach((password) => {
      // then
      expect(VALIDATOR.PASSWORD.test(password)).toBeFalsy()
    })
  })

  it("유효한 유저 비밀번호는 정규 표현식 테스트에 통과해야 한다.", () => {
    validPasswords.forEach((password) => {
      // then
      expect(VALIDATOR.PASSWORD.test(password)).toBeTruthy()
    })
  })

  it("유효하지 않은 이메일는 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    invalidEmails.forEach((email) => {
      // then
      expect(VALIDATOR.EMAIL.test(email)).toBeFalsy()
    })
  })

  it("유효한 이메일는 정규 표현식 테스트에 통과해야 한다.", () => {
    validEmails.forEach((email) => {
      // then
      expect(VALIDATOR.EMAIL.test(email)).toBeTruthy()
    })
  })
})
