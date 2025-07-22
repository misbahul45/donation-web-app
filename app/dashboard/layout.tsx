import { auth } from '@/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const layout = async({ children }:{ children: React.ReactNode}) => {
    const session=await auth.api.getSession({
        headers:await headers()
    })
    if(!session?.user.emailVerified){
        redirect('/verify-email')
    }
  return (
    <>
      {children}
    </>
  )
}

export default layout
