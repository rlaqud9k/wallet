import { Response } from 'express'

export const errorHandler = (err: unknown, res: Response) => {
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message })
  }
  return res.status(500).json({ message: 'Unexpected Error' })
}

export const responseHandler = (data: object, res: Response) => {
  return res.status(200).json({ data: data })
}
