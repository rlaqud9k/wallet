import { checkSchema } from 'express-validator'

const amountValidationCheck = (value: number) => {
  if (value > 0) {
    return true
  } else {
    throw new Error('Invalid amount')
  }
}

export const sellBuyRequestCheckSchema = checkSchema({
  id: {
    isUUID: true,
    exists: true
  },
  amount: {
    isNumeric: true,
    exists: true,
    custom: {
      options: amountValidationCheck
    }
  }
})

export const sendRequestCheckSchema = checkSchema({
  id: {
    isUUID: true,
    exists: true
  },
  amount: {
    isNumeric: true,
    exists: true,
    custom: {
      options: amountValidationCheck
    }
  },
  takerId: {
    isUUID: true,
    exists: true
  }
})
