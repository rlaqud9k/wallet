import { checkSchema } from 'express-validator'

export const signUpRequestCheckSchema = checkSchema({
  name: {
    isString: true,
    exists: true
  },
  mail: {
    isEmail: true,
    exists: true
  },
  age: {
    isInt: true,
    exists: true
  },
  gender: {
    isBoolean: true,
    exists: true
  }
})

export const infoRequestCheckSchema = checkSchema({
  id: {
    isUUID: true,
    exists: true
  }
})
