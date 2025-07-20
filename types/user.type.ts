import { Role, User } from "@prisma/client"

export type UserWithRolesPartial = Pick<User, 'id' | 'name' | 'email'> & {
  roles: Array<{
    role:Role
  }>
}