'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MailCheck, Send, Mail, CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import React, { useEffect, useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/Spinner'
import Link from 'next/link'
import { TokenSchemaType, tokenSchema, emailSchema, EmailSchemaType } from '@/schemas/auth.schema'


const page = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const {
    register: registerToken,
    handleSubmit: handleSubmitToken,
    formState: { errors: tokenErrors, isSubmitting: isTokenSubmitting },
    reset: resetTokenForm,
  } = useForm<TokenSchemaType>({
    resolver: zodResolver(tokenSchema),
  })

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    watch,
    reset: resetEmailForm,
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(emailSchema),
  })

  const emailValue = watch('email')

  const onSubmitToken = async (data: TokenSchemaType) => {
    try {
      const res = await authClient.verifyEmail({
        query: {
          token: data.token,
        },
      })

      if (res.error?.message) {
        setMessage({ type: 'error', content: res.error.message })
      } else {
        setIsVerified(true)
        setMessage({ type: 'success', content: 'Email verified successfully! Redirecting to dashboard...' })
        router.refresh()
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'An unexpected error occurred. Please try again.' })
    }
  }

  const onSubmitEmail = async (data: EmailSchemaType) => {
    startTransition(async () => {
      try {
        const res = await authClient.sendVerificationEmail({ email: data.email })

        if (res.error?.message) {
          setMessage({ type: 'error', content: res.error.message })
        } else {
          setMessage({ type: 'success', content: 'Verification email sent successfully! Please check your inbox.' })
          resetEmailForm()
          setShowEmailInput(false)
        }
      } catch (error) {
        setMessage({ type: 'error', content: 'Failed to send verification email. Please try again.' })
      }
    })
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [message])

  if (isVerified) {
    return (
      <div className="min-h-screen flex justify-center items-center w-full px-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <Card className="w-full max-w-md shadow-2xl border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">Email Verified!</h2>
                <p className="text-green-600 dark:text-green-400 mt-2">
                  Your email has been successfully verified. Redirecting to dashboard...
                </p>
              </div>
              <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center items-center w-full px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-2xl border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Verify Your Email
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Check your email for a verification link, or enter the verification token below
            </p>
            <Badge variant="secondary" className="text-xs">
              Step 2 of 3
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {message && (
              <Alert className={`${message.type === 'error' ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : 'border-green-200 bg-green-50 dark:bg-green-950/20'}`}>
                <div className="flex items-center gap-2">
                  {message.type === 'error' ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription className={message.type === 'error' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}>
                    {message.content}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmitToken(onSubmitToken)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="token" className="text-sm font-medium">
                  Verification Token
                </label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter your verification token"
                  className="h-11"
                  {...registerToken('token')}
                />
                {tokenErrors.token && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {tokenErrors.token.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 h-11" 
                  type="submit" 
                  disabled={isTokenSubmitting}
                >
                  {isTokenSubmitting ? (
                    <Spinner text="Verifying..." />
                  ) : (
                    <>
                      <MailCheck className="w-4 h-4 mr-2" />
                      Verify Email
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowEmailInput(!showEmailInput)}
                  type="button"
                  variant="outline"
                  className="h-11 px-4"
                  disabled={isTokenSubmitting}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {showEmailInput && (
              <div className="pt-4 border-t space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Resend Verification Email</h3>
                </div>
                
                <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="resend-email" className="text-sm font-medium">
                      Your Email Address
                    </label>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="Enter your email address"
                      className="h-11"
                      {...registerEmail('email')}
                    />
                    {emailErrors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {emailErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1 h-11"
                      disabled={isPending || !emailValue || isEmailSubmitting}
                    >
                      {isPending ? (
                        <Spinner text="Sending..." />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Email
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => setShowEmailInput(false)}
                      type="button"
                      variant="ghost"
                      className="h-11 px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/sign-in" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page