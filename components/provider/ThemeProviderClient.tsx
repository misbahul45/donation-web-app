'use client'

import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

export default function ThemeProviderClient({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
