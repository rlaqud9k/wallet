export type Transaction = {
  transaction_amount: number
  created_at: Date
}

export type ErrorResponse = {
  message: string
}

export type CustomResponse<T> = {
  data: T
}

export type SignUpResponse = {
  user: User
}
type User = {
  id: string
  name: string
  mail: string
  age: number
  gender: boolean
  created_at: Date
  updated_at: Date
}

export type InfoResponse = {
  id: string
  balance: number
  transactions: Transaction[]
}

export type SellBuyResponse = {
  balance: Balance
}

export type SendResponse = {
  sender: Balance
  taker: Balance
}

type Balance = {
  id: number
  user_id: string
  balance: string
  created_at: Date
  updated_at: Date
}
