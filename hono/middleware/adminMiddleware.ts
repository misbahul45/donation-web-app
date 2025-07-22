import { MiddlewareHandler } from 'hono'
import { ErrorCustom } from '@/lib/error'
import { auth } from '@/auth'
import { headers } from 'next/headers'

export const adminMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({
    headers:await headers()
  })

  const user = session?.user

  if (!user || !user.roles.includes('ADMIN')) {
    throw new ErrorCustom('Unauthorized: Admin access only', 403)
  }

  await next()
}
