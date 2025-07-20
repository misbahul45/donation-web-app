import { Hono } from 'hono'
import { prisma } from '@/lib/prisma'
import { zValidator } from '@hono/zod-validator'
import { UserParamSchema, UserSearchSchema } from '@/schemas/user.schema'
import { success, failure } from '@/lib/utils'
const userRouter = new Hono()

userRouter.get(
  '/',
  zValidator('query', UserSearchSchema),
  async (c) => {
    const { q, role, page, limit } = c.req.valid('query')

    try {
      const users = await prisma.user.findMany({
        where: {
          AND: [
            q
              ? {
                  OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                  ],
                }
              : {},
            role
              ? {
                  roles: {
                    some: {
                      role,
                    },
                  },
                }
              : {},
          ],
        },
        include: {
          roles: {
            select: {
              role: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
      })

      return c.json(success('Successfully fetched users', users))
    } catch (err) {
      
    }
  }
)

userRouter.get(
  '/:id',
  zValidator('param', UserParamSchema),
  async (c) => {
    const id = c.req.param('id')

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          roles: {
            select: {
              role: true,
            },
          },
        },
      })

      if (!user) {
        return c.json(failure('User not found'), 404)
      }

      return c.json(success('Successfully fetched user', user))
    } catch (err) {
      return c.json(failure('Failed to fetch user', err), 500)
    }
  }
)

export default userRouter
