'use client'
import React, { useActionState, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signinSchema, SigninSchemaType, signupSchema, SignupSchemaType } from '@/schemas/auth.schema'
import { signinAction } from '@/actions/auth.action'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Eye, EyeOff } from 'lucide-react'

const initialState: { success?: string; error?: string } | null = null

function formReducer(_: typeof initialState, formData: FormData) {
  return signinAction(formData as unknown as SigninSchemaType)
}

const SigninForm = () => {
  const [state, formAction] = useActionState(formReducer, initialState)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      email: '',
    },
  })

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="*******"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {state?.error && <p className="text-red-500">{state.error}</p>}
        {state?.success && <p className="text-green-600">{state.success}</p>}
        <Button disabled={!form.formState.isValid} type="submit" className='w-full disabled:cursor-not-allowed font-semibold cursor-pointer'>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default SigninForm
