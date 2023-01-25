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
    exists: true,
    custom: {
      options: (value) => {
        if (value >= 0) {
          return true
        } else {
          throw new Error('Invalid age')
        }
      }
    }
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
