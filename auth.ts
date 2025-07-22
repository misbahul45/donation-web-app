import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
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
    emailVerification: {
        autoSignInAfterVerification:true,
        sendOnSignUp:true,
        sendVerificationEmail: async ({ user, url, token}) => {
            await sendVerificationEmail({
                to: user.email,
                username:user.name,
                url,
                token
            })
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



type Auth = typeof auth;

export type BetterSession = Auth["$Infer"]["Session"] & {
  user: Auth["$Infer"]["Session"]["user"] & {
    roles: string[];
  };
};