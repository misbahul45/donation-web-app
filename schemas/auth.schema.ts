import { z } from 'zod'

export const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Nama harus minimal 2 karakter' }).max(100, { message: 'Nama terlalu panjang' }),
    email: z.string().email({ message: 'Format email tidak valid' }),
    password: z.string().min(8, { message: 'Password harus minimal 8 karakter' }).max(100, { message: 'Password terlalu panjang' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password tidak cocok'
  })

export const signinSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(8, { message: 'Password harus minimal 8 karakter' })
})

export const tokenSchema = z.object({
  token: z.string().min(6, 'Token must be at least 6 characters'),
})

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type TokenSchemaType = z.infer<typeof tokenSchema>
export type EmailSchemaType = z.infer<typeof emailSchema>
export type SignupSchemaType = z.infer<typeof signupSchema>
export type SigninSchemaType = z.infer<typeof signinSchema>
