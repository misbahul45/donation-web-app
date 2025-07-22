import { Context, Hono } from 'hono'
import { handle } from 'hono/vercel'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import userRouter from '@/hono/routes/user.route'
import { API_RESPON } from '@/types'
import { handleAppError } from '@/lib/error'
import { failure } from '@/lib/utils'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.use('*', cors())
app.use(logger())

app.route('/users', userRouter)

app.get('/health', (c) => {
  const res: API_RESPON<null> = {
    message: 'Hello from Hono!',
    success: true,
    data: null,
    err: null,
    meta: undefined,
  }
  return c.json(res)
})

app.notFound((c) => {
  const res = failure('Route not found')
  return new Response(JSON.stringify(res), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
})

app.onError((err, c: Context) => {
  const error = handleAppError(err)
  const res = failure(error.message, error.details)
  return new Response(JSON.stringify(res), {
    status: error.statusCode,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
