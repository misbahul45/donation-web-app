import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { logger } from 'hono/logger'
import { auth } from '@/auth'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.use(logger())

app.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});


app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!'
  })
})

export const GET = handle(app)
