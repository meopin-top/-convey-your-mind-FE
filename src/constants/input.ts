export const VALIDATOR = {
  USER_ID: /^[a-zA-Z0-9!@#$%^&*()-_=+{}\[\]|\\;:'",.<>/?]{6,20}$/,
  ENGLISH: /(?=.*[a-zA-Z]).+/,
  NUMBER: /(?=.*\d).+/,
  SPECIAL_CHARACTER: /(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>?]).+/,
  PASSWORD:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>?])(?=.*[a-zA-Z\d!@#$%^&*()\-_=+[\]{};:'",.<>?]).{8,20}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
} as const
