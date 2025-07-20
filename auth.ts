import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import env from "./lib/env";
import { sendVerificationEmail } from "./lib/email";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        requireEmailVerification: true,
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
        autoSignInAfterVerification:true,
        sendOnSignUp:true,
        sendVerificationEmail: async ({ user, url, token}) => {
            try{
                const send=await sendVerificationEmail({
                        to: user.email,
                        username:user.name,
                        url,
                        token
                    })
                console.log(send)
            }catch(e){
                console.log(e)
            }
        }
    },
    plugins: [nextCookies(),
        customSession(async ({ user, session }) => {
            const dbUser = await prisma.user.findUnique({
                where: { id: session.userId },
                include: {
                    roles: {
                        select: { role: true },
                    },
                },
            });

            return {
                user: {
                ...user,
                roles: dbUser?.roles.map((r) => r.role) || [],
                },
                session,
            };
        })

    ]
});


export type BetterSession = typeof auth.$Infer.Session