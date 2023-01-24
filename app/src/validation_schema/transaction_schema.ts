import { checkSchema } from 'express-validator'

export const sellBuyRequestCheckSchema = checkSchema({
  id: {
    isUUID: true,
    exists: true
  },
  amount: {
    isNumeric: true,
    exists: true
  }
})

export const sendRequestCheckSchema = checkSchema({
  id: {
    isUUID: true,
    exists: true
  },
  amount: {
    isNumeric: true,
    exists: true
  },
  takerId: {
    isUUID: true,
    exists: true
  }
})
