'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MailCheck, Send } from 'lucide-react'
import React, { useEffect, useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/Spinner'

const formSchema = z.object({
  token: z.string().min(1),
})

type FormValues = z.infer<typeof formSchema>

const page = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [emailForResend, setEmailForResend] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async(data: FormValues) => {
      const res = await authClient.verifyEmail({
        query: {
          token: data.token,
        },
      })


      if (res.error?.message) {
        setError(res.error.message)
      } else {
        setMessage('Email verified successfully! Redirecting...')
        router.refresh()
        setTimeout(() => {
          router.push('/app')
        }, 1500)
      }
  }

  const handleSendVerification = async () => {
    if (!emailForResend) return
    startTransition(async () => {
      const res = await authClient.sendVerificationEmail({ email: emailForResend })

      if (res.error?.message) {
        setError(res.error.message)
      } else {
        setMessage('Verification email sent successfully!')
      }
    })
  }

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError(null)
        setMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [error, message])

  return (
    <div className="pt-32 w-full px-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <label htmlFor="token" className="text-sm font-medium text-muted-foreground">
                Token
              </label>
              <Input id="token" type="text" placeholder="Verification token" {...register('token')} />
              {errors.token && <p className="text-sm text-red-500">{errors.token.message}</p>}
            </div>
            <div className="flex gap-4">
              <Button className="flex-1 gap-2 cursor-pointer" type="submit" disabled={isPending}>
                 {isSubmitting?
                    <Spinner text='verifying....' />
                    :
                    <>
                        <MailCheck size={18} />
                        Verify Email
                    </>
                 }
              </Button>
              <Button
                onClick={() => setShowEmailInput(true)}
                type="button"
                variant="outline"
                className="gap-2"
              >
                <Send size={18} />
                Resend
              </Button>
            </div>
          </form>

          {showEmailInput && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-2">
                <label htmlFor="resend-email" className="text-sm font-medium text-muted-foreground">
                  Your Email
                </label>
                <Input
                  id="resend-email"
                  type="email"
                  placeholder="Enter your email"
                  value={emailForResend}
                  onChange={(e) => setEmailForResend(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSendVerification}
                className="w-full gap-2 cursor-pointer"
                disabled={isPending || !emailForResend}
              >
                <Send size={18} />
                Send Verification Email
              </Button>
            </div>
          )}

          {(error || message) && (
            <div className="mt-4 text-sm text-center">
              {error && <p className="text-red-500">{error}</p>}
              {message && <p className="text-green-600">{message}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default page
