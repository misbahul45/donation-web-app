'use server'
import { auth, BetterSession } from "@/auth"
import { prisma } from "@/lib/prisma"
import { signinSchema, SigninSchemaType, signupSchema, SignupSchemaType } from "@/schemas/auth.schema"
import { BetterAuthError } from "better-auth"
import { headers } from "next/headers"


export const getMe = async (): Promise<BetterSession | undefined> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return undefined;

  return session as BetterSession;
};



export const signupAction = async (values:SignupSchemaType) => {
  const validatedFields = signupSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, email, password } = validatedFields.data

  try {
    const existingUser=await prisma.user.count({
      where:{
        email
      }
    })

    if(existingUser>0){
      throw new Error('User already exist')
    }
    const res = await auth.api.signUpEmail({
        body:{
            email,
            password,
            name,
        }
    })

    const userId=res.user.id

    await prisma.userRole.upsert({
      where: {
        userId_role: {
          userId,
          role: 'DONOR'
        }
      },
      update: {},
      create: {
        userId,
        role: 'DONOR'
      }
    })

    return { success: 'Account created!, please check your email for verify account' }
  } catch (error) {

    return { error: (error as Error).message || 'something wrong' }
  }
}

export const signinAction = async (values:SigninSchemaType) =>{
  const validatedFields = signinSchema.safeParse(values)
  
  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }
  try{
    const { email, password } = validatedFields.data

    await auth.api.signInEmail({
      body:{
        email,
        password
      },
    })


    return { success: 'Success sign your account' }
  }catch(error){

    return { error: (error as Error).message || 'Something went wrong!' }
  }
}
