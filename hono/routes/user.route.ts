import { zValidator } from "@hono/zod-validator"
import { prisma } from "@/lib/prisma"
import { userParamSchema, userPatchSchema, userSearchSchema } from "@/schemas/user.schema"
import { ErrorCustom } from "@/lib/error"
import { hashPassword, success } from "@/lib/utils"
import { Hono } from "hono"
import { Prisma } from "@prisma/client"
import { adminMiddleware } from "../middleware/adminMiddleware"
import { authMiddleware } from "../middleware/userMiddleware"

const userRouter=new Hono()

userRouter.get(
  '/',
  authMiddleware,
  adminMiddleware,
  zValidator('query', userSearchSchema),
  async (c) => {
    const { q, role, page, limit } = c.req.valid('query')

    const whereClause = {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
                { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
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
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          roles: {
            select: {
              role: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ])

    return c.json(
      success('Successfully fetched users', users, {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      })
    )
  }
)

userRouter.get(
  '/:id',
  authMiddleware,
  zValidator('param', userParamSchema),
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
        throw new ErrorCustom('User not found', 404)
      }

      return c.json(success('Successfully fetched user', user))
    } catch (err) {
      throw err
    }
  }
)


userRouter.patch(
  '/:id',
  authMiddleware,
  zValidator('param', userParamSchema),
  zValidator('json', userPatchSchema),
  async(c)=>{
    const id=c.req.param('id')
     const body = c.req.valid('json') 
    try {
      if(body.password){
        const hashed = await hashPassword(body.password)
        await prisma.account.updateMany({
          where: {
            userId: id,
            password: { not: null },
          },
          data: {
            password: hashed,
            updatedAt: new Date(),
          },
        })
      }

      if (body.roles && body.roles.length > 0) {
        for (const r of body.roles) {
          await prisma.userRole.upsert({
            where: {
              userId_role: {
                userId: id,
                role: r,
              },
            },
            update: {},
            create: {
              userId: id,
              role: r,
            },
          })
        }
      }

      const { name, email, image } = body
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(image && { image }),
          updatedAt: new Date(),
        },
        include: {
          roles: { select: { role: true } },
        },
      })

      return c.json(success('User updated successfully', updatedUser))
    } catch (error) {
      throw error
    }
  }
)


export default userRouter