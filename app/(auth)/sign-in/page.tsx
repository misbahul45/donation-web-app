import FormOuauth from '@/components/auth/FormOuauth'
import SigninForm from '@/components/auth/SigninForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='w-full pt-8 pb-4 px-4 max-w-2xl mx-auto space-y-8'>
      <h1 className='text-center text-xl sm:text-3xl md:text-4xl font-bold mb-4'>
        Selamat Datang di <span className='text-primary'>Donation Hub</span>
      </h1>
      <p className='text-center text-muted-foreground text-base sm:text-lg'>
        Belum memiliki akun?{' '}
        <Link href='/sign-up'>
          <Button variant='link' asChild>
            <span className='text-primary underline underline-offset-4'>Daftar sekarang</span>
          </Button>
        </Link>
      </p>

      <FormOuauth />

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex-1 border-t" />
        <span>or</span>
        <div className="flex-1 border-t" />
      </div>

      <SigninForm />
    </div>
  )
}

export default page
