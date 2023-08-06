export const validUserId = "test123"
export const validUserIds = [
  "test123",
  "asdf123",
  "nm,zxv",
  "asdfasdf",
  "123123123123",
  "!@#!@#!@!@#!@#",
]
export const invalidUserIds = [
  "한글asdf12",
  "123",
  "asdfasdfsdaasfdafsasfdafsaf",
  ")NCVADSF母",
]

export const validPassword = "test1234!@#$"
export const validPasswords = [
  "test1234!@#$",
  "asdf1234!@#$",
  "!@#safd^%0",
  "asdf123<>?",
  "__!@#asdf0@",
  "Abcd1234!",
  "P@ssw0rd",
  "12@#$ABcd!9",
]
export const invalidPasswords = [
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

export const validEmail = "qwer@naver.com"
export const validEmails = [
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
export const invalidEmails = [
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
