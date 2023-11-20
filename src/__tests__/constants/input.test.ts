import {VALIDATOR} from "@/constants/input"
import {
  INVALID_USER_IDS,
  VALID_USER_IDS,
  INVALID_PASSWORDS,
  VALID_PASSWORDS,
  INVALID_EMAILS,
  VALID_EMAILS,
  WITHOUT_ENGLISHES,
  WITH_ENGLISHES,
  WITHOUT_NUMBERS,
  WITH_NUMBERS,
  WITHOUT_SPECIAL_CHARACTERS,
  WITH_SPECIAL_CHARACTERS,
} from "@/__mocks__/fixtures/input"

describe("VALIDATOR", () => {
  it("유효하지 않은 유저 아이디는 유저 아이디 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    // given, when

    INVALID_USER_IDS.forEach((userId) => {
      // then
      expect(VALIDATOR.USER_ID.test(userId)).toBeFalsy()
    })
  })

  it("유효한 유저 아이디는 유저 아이디 정규 표현식 테스트에 통과해야 한다.", () => {
    // given, when

    VALID_USER_IDS.forEach((userId) => {
      expect(VALIDATOR.USER_ID.test(userId)).toBeTruthy()
    })
  })

  it("유효하지 않은 유저 비밀번호는 비밀번호 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    // given, when

    INVALID_PASSWORDS.forEach((password) => {
      // then
      expect(VALIDATOR.PASSWORD.test(password)).toBeFalsy()
    })
  })

  it("유효한 유저 비밀번호는 비밀번호 정규 표현식 테스트에 통과해야 한다.", () => {
    // given, when

    VALID_PASSWORDS.forEach((password) => {
      // then
      expect(VALIDATOR.PASSWORD.test(password)).toBeTruthy()
    })
  })

  it("영어가 포함되지 않은 비밀번호는 영어 확인 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    // given, when

    WITHOUT_ENGLISHES.forEach((password) => {
      // then
      expect(VALIDATOR.ENGLISH.test(password)).toBeFalsy()
    })
  })

  it("영어가 포함된 비밀번호는 영어 확인 정규 표현식 테스트에 통과해야 한다.", () => {
    // given, when

    WITH_ENGLISHES.forEach((password) => {
      // then
      expect(VALIDATOR.ENGLISH.test(password)).toBeTruthy()
    })
  })

  it("숫자가 포함되지 않은 비밀번호는 숫자 확인 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    // given, when

    WITHOUT_NUMBERS.forEach((password) => {
      // then
      expect(VALIDATOR.NUMBER.test(password)).toBeFalsy()
    })
  })

  it("숫자가 포함된 비밀번호는 숫자 확인 정규 표현식 테스트에 통과해야 한다.", () => {
    // given, when

    WITH_NUMBERS.forEach((password) => {
      // then
      expect(VALIDATOR.NUMBER.test(password)).toBeTruthy()
    })
  })

  it("특수 문자가 포함되지 않은 비밀번호는 특수 문자 확인 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    // given, when

    WITHOUT_SPECIAL_CHARACTERS.forEach((password) => {
      // then
      expect(VALIDATOR.SPECIAL_CHARACTER.test(password)).toBeFalsy()
    })
  })

  it("특수 문자가 포함된 비밀번호는 특수 문자 확인 정규 표현식 테스트에 통과해야 한다.", () => {
    // given, when

    WITH_SPECIAL_CHARACTERS.forEach((password) => {
      // then
      expect(VALIDATOR.SPECIAL_CHARACTER.test(password)).toBeTruthy()
    })
  })

  it("유효하지 않은 이메일는 이메일 정규 표현식 테스트에 통과하지 않아야 한다.", () => {
    // given, when

    INVALID_EMAILS.forEach((email) => {
      // then
      expect(VALIDATOR.EMAIL.test(email)).toBeFalsy()
    })
  })

  it("유효한 이메일는 이메일 정규 표현식 테스트에 통과해야 한다.", () => {
    // given, when

    VALID_EMAILS.forEach((email) => {
      // then
      expect(VALIDATOR.EMAIL.test(email)).toBeTruthy()
    })
  })
})
