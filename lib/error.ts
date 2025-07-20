// lib/error.ts
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export class ErrorCustom extends Error {
  statusCode: number
  details?: unknown

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message)
    this.name = 'ErrorCustom'
    this.statusCode = statusCode
    this.details = details
  }
}

export function handleAppError(err: unknown): ErrorCustom {
  if (err instanceof ErrorCustom) {
    return err
  }

  if (err instanceof ZodError) {
    return new ErrorCustom('Validation failed', 422, err.flatten())
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return new ErrorCustom(`Database error: ${err.message}`, 500, {
      code: err.code,
      meta: err.meta,
    })
  }

  if (err instanceof Error) {
    return new ErrorCustom(err.message, 500)
  }

  return new ErrorCustom('Unknown error occurred', 500, err)
}
