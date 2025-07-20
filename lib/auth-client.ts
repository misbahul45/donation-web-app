import type { auth } from "@/auth"
import { createAuthClient } from "better-auth/react"

import { customSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    plugins:[customSessionClient<typeof auth>()]
})

export const { signIn, signUp, useSession } = createAuthClient()