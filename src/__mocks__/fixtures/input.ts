export const VALID_USER_ID = "test123"
export const VALID_USER_IDS = [
  "test123",
  "asdf123",
  "nm,zxv",
  "asdfasdf",
  "123123123123",
  "!@#!@#!@!@#!@#",
]
export const INVALID_USER_IDS = [
  "한글asdf12",
  "123",
  "asdfasdfsdaasfdafsasfdafsaf",
  ")NCVADSF母",
]

export const VALID_PASSWORD = "test1234!@#$"
export const VALID_PASSWORDS = [
  "test1234!@#$",
  "asdf1234!@#$",
  "!@#safd^%0",
  "asdf123<>?",
  "__!@#asdf0@",
  "Abcd1234!",
  "P@ssw0rd",
  "12@#$ABcd!9",
]
export const INVALID_PASSWORDS = [
  "!@#safd^%",
  "asdf1234",
  "zxcvjkl123",
  "qwer1234qwer1234qwer1234",
  "한글123asdf",
  "韓字123asdf",
  "!@#$$%^&(^&(*",
  "asdfasdfasdf",
  "1231231212",
]

export const VALID_EMAIL = "qwer@naver.com"
export const VALID_EMAILS = [
  "qwer@naver.com",
  "example@example.com",
  "john.doe123@gmail.com",
  "alice_1234@yahoo.co.kr",
  "jsmith+test@example.co.uk",
  "12345@example.com",
  "test-email@example-domain.co",
  "user%name@example.org",
  "john-123@example.com",
  "email@example12345.com",
  "myemail@sub.domain.com",
]
export const INVALID_EMAILS = [
  "justtext",
  "@example.com",
  "john.doe@example",
  "example@.com",
  "test email@example.com",
  "john.doe@example..com",
  "email@example_com",
  "john$doe@example.com",
  "john.doe@example_domain.com",
  "email@12345",
]

export const WITH_ENGLISHES = [
  "abcdfasdf",
  "asfdkj123",
  "zxcvn21!#f",
  ".vcm,z.12i9",
  "ㅁㄴㅇㄹasdf",
]
export const WITHOUT_ENGLISHES = [
  "12313123123",
  '""""""""././.',
  "ㅁㄴㅇㅁ★☆////",
  "漢子ㄹㄹㄹㄹ123",
]

export const WITH_NUMBERS = [
  "미럼ㅇㄴ123",
  "asdf123123",
  "123123213213239908",
  "/,.zxmcv.123",
]
export const WITHOUT_NUMBERS = [
  "ㅁㄴㅇㄻㄴㄹㅇㅋㅊㅌ푸ㅡ./.,/",
  "ASDFasdfzxvc,.",
  "//..,,mmnvcbjooqㅁㄴㅇㄹ",
  "!#$&^%!%zcxv",
]

export const WITH_SPECIAL_CHARACTERS = [
  '"ffcnm1"',
  "'ffcmn./",
  "()12njkcv",
  "5%%5nvmㅇㅇㄻ",
]
export const WITHOUT_SPECIAL_CHARACTERS = [
  "ffnmcv123",
  "fmc123123ㅁㄴㅇㄹ",
  "cnm아아ㅏㅇ아",
]
