import FormOuauth from '@/components/auth/FormOuauth'
import SignupForm from '@/components/auth/SignupForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="w-full pt-8 pb-4 px-4 max-w-4xl mx-auto space-y-8">
      <h1 className="text-center text-xl sm:text-3xl md:text-5xl font-bold mb-4">
        Bergabung Bersama <span className='text-primary'>Donation Hub</span>
      </h1>

      <p className="text-center text-sm font-medium sm:text-base md:text-lg text-gray-700 leading-relaxed">
        Donation Hub adalah platform yang menjembatani para dermawan dengan berbagai proyek
        kolaboratif yang berdampak positif bagi masyarakat. Melalui aplikasi ini, Anda dapat
        berkontribusi secara langsung dalam mewujudkan perubahan untuk kemaslahatan umat.
      </p>

      <FormOuauth />

      {/* Garis pembatas dengan teks OR */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-sm text-muted-foreground">atau</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      <SignupForm />

      <p className='text-sm text-muted-foreground'>
        Sudah punya akun?
        <Link href="/sign-in" className='font-semibold'>
          <Button variant="link" asChild>
            <span className="text-primary underline underline-offset-4">Masuk di sini</span>
          </Button>
        </Link>
      </p>

      <p className='md:text-sm text-xs dark:text-gray-600 text-gray-300 text-center'>
        Dengan mendaftar, Anda menyetujui Ketentuan Layanan, Kebijakan Privasi, dan Ketentuan Penggunaan kami.
      </p>
    </div>
  )
}

export default page
