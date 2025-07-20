'use client'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupSchemaType } from '@/schemas/auth.schema'
import { signupAction } from '@/actions/auth.action'
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
import { useActionForm } from '@/hook/useActionForm'
import { Spinner } from '../ui/Spinner'
import { useRouter } from 'next/navigation'

const extractSignupValues = (formData: FormData) => ({
  name: formData.get('name') as string,
  email: formData.get('email') as string,
  password: formData.get('password') as string,
  confirmPassword: formData.get('confirmPassword') as string,
})

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const router=useRouter();

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { state, formAction } = useActionForm({
    action: signupAction,
    extractValues: extractSignupValues,
  })

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData)
      router.refresh()
      router.push('/verify-email')
    })
  }


  return (
    <Form {...form}>
      <form action={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="misbahulexample" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="*******"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {state?.error && <p className="text-red-500">{state.error}</p>}
        {state?.success && <p className="text-green-600">{state.success}</p>}

        <Button
          disabled={!form.formState.isValid || isPending}
          type="submit"
          className="w-full disabled:cursor-not-allowed font-semibold cursor-pointer"
        >
          {isPending ? <Spinner text='Mengirim...' />: 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

export default SignupForm
