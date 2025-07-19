'use server'
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { signinSchema, SigninSchemaType, signupSchema, SignupSchemaType } from "@/schemas/auth.schema"
import { BetterAuthError } from "better-auth"
import { headers } from "next/headers"

export const getMe=async()=>{
    const session=await auth.api.getSession({
        headers: await headers()
    })
    return session?.user
}


export const signupAction = async (values:SignupSchemaType) => {
  const validatedFields = signupSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, email, password } = validatedFields.data

  try {
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

    return { success: 'Account created!' }
  } catch (error) {
    if (error instanceof BetterAuthError) {
      if (error.cause === 'CredentialsSignin') {
        return { error: 'Invalid credentials!' }
      }
      return { error: 'Something went wrong!' }
    }

    return { error: 'Something went wrong!' }
  }
}

export const signinAction = async (values:SigninSchemaType) =>{
  const validatedFields = signinSchema.safeParse(values)
  
  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }
  try{
    const { email, password } = validatedFields.data

    auth.api.signInEmail({
      body:{
        email,
        password
      }
    })

    return { success: 'Success sign your account' }
  }catch(error){
    if (error instanceof BetterAuthError) {
      if (error.cause === 'CredentialsSignin') {
        return { error: 'Invalid credentials!' }
      }
      return { error: 'Something went wrong!' }
    }

    return { error: 'Something went wrong!' }
  }
}
