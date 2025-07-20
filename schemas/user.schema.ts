import z from "zod";
import { PaginationSchema } from "./index.schema";
import { Role } from "@prisma/client";

export const UserParamSchema=z.object({
    id:z.uuid()
})


export const RoleEnum = z.enum([Role.ADMIN, Role.DONOR, Role.REQUESTER])

export const UserSearchSchema = z
  .object({
    q: z.string().min(2).optional(),
    role: RoleEnum.optional(),
  })
  .merge(PaginationSchema)