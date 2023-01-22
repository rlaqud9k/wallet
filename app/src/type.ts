export type ResponseData<T> = {
  status: number
  data: T
}

export type ErrorData = {
  status: number
  message: string
}
