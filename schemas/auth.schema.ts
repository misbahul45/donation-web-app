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

export type SignupSchemaType = z.infer<typeof signupSchema>
export type SigninSchemaType = z.infer<typeof signinSchema>
