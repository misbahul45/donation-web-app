import z from "zod";
import { PaginationSchema } from "./index.schema";
import { Role } from "@prisma/client";

export const userParamSchema=z.object({
    id:z.uuid()
})


export const RoleEnum = z.enum([Role.ADMIN, Role.DONOR, Role.REQUESTER])

export const userSearchSchema = z
  .object({
    q: z.string().min(2).optional(),
    role: RoleEnum.optional(),
  })
  .merge(PaginationSchema)


export const userPatchSchema=z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  roles: z.array(z.enum(['ADMIN', 'DONOR', 'REQUESTER'])).optional()
})