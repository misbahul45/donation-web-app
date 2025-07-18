import React from 'react'
import { ThemeToggle } from './ThemeToggle'

const Header = () => {
  return (
    <header className='w-full sticky top-0 left-0 py-4 flex justify-between lg:px-20 md:px-16 sm:px-10 px-4  z-50 backdrop-blur'>
      <h1>Logo</h1>
      <nav></nav>
      <div className='flex itesm-center gap-4'>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
