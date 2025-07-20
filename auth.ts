import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import env from "./lib/env";
import { sendVerificationEmail } from "./lib/email";
import { nextCookies } from "better-auth/next-js";
 
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
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
        sendVerificationEmail: async ({ user, url}) => {
            try{
                const send=await sendVerificationEmail({
                        to: user.email,
                        username:user.name,
                        url
                    })
                console.log(send)
            }catch(e){
                console.log(e)
            }
        }
    },
    plugins: [nextCookies()]
});