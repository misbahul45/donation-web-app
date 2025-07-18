import React from 'react'
import { Button } from '../ui/button'
import { Github } from 'lucide-react'

const GoogleIcon=()=>{
    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 533.5 544.3"
            >
            <path
                fill="#4285F4"
                d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.3H272v95.2h146.9c-6.3 33.8-25.3 62.5-54 81.6v67h87.2c51-47 81.4-116.1 81.4-193.5z"
            />
            <path
                fill="#34A853"
                d="M272 544.3c73.6 0 135.4-24.4 180.5-66.4l-87.2-67c-24.2 16.2-55.1 25.7-93.3 25.7-71.7 0-132.4-48.3-154.1-113.2h-89v70.7C84.5 477.3 172.4 544.3 272 544.3z"
            />
            <path
                fill="#FBBC05"
                d="M117.9 323.4c-10.2-30.2-10.2-62.6 0-92.8v-70.7h-89C-7.7 220.2-7.7 324.1 28.9 414.5l89-70.7z"
            />
            <path
                fill="#EA4335"
                d="M272 107.7c39.9 0 75.8 13.7 104.1 40.7l78-78C407.3 24.4 345.5 0 272 0 172.4 0 84.5 67 28.9 167.3l89 70.7C139.6 156 200.3 107.7 272 107.7z"
            />
        </svg>
    )
}

const FormOuauth = () => {
  return (
    <div className='flex gap-4 items-center w-full mx-auto'>
      <Button variant={'outline'} className='flex-1'>
        <GoogleIcon />
        Signin with google
      </Button>
      <Button className='flex-1' variant={'secondary'}>
        <Github />
        Signin with github
      </Button>
    </div>
  )
}

export default FormOuauth
 
