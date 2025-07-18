import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import env from "./lib/env";
import { sendVerificationEmail } from "./lib/email";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true, 
    }, 
   socialProviders: {
        github: {
            clientId: env.oauth.github.clientId!,
            clientSecret: env.oauth.github.clientSecret!,
        },
        google: {
            clientId: env.oauth.google.clientId!,
            clientSecret: env.oauth.google.clientSecret!,
        },
    },
     emailVerification: {
        sendVerificationEmail: async ({ user, url, }) => {
            await sendVerificationEmail({
                to: user.email,
                username:user.name,
                url
            })
        }
    }
});