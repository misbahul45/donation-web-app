import { auth } from "@/auth";
import { ErrorCustom } from "@/lib/error";
import { Context, MiddlewareHandler } from "hono";
import { headers } from "next/headers";

export const authMiddleware:MiddlewareHandler=async(c:Context, next)=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })

    if(!session?.user){
        throw new ErrorCustom('Unauthorized', 400)
    }

    c.set('user', session.user) 
    return next()
}