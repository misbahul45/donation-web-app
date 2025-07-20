'use client';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BetterSession } from '@/auth';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface HeaderProps{
  session?:BetterSession
}



const Header:React.FC<HeaderProps> = ({ session }) => {

  const router=useRouter()

  console.log(session)

  return (
    <header className="w-full sticky top-0 left-0 py-4 flex justify-between lg:px-20 md:px-16 sm:px-10 px-4 z-50 backdrop-blur">
      <h1>Logo</h1>
      <nav></nav>

      <div className="flex gap-4 items-center">
        <ThemeToggle />
        {session && session.user.emailVerified ? (
          <DropdownMenu>
            <DropdownMenuTrigger className='p-4 cursor-pointer border-none outline-none'>{session.user.name}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant={'ghost'} onClick={()=>{
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/sign-in");
                        router.refresh()
                      },
                    },
                  })
                }}>
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/sign-in" className="cursor-pointer">
                Sign in
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up" className="cursor-pointer text-sm font-semibold">
                Bergabung Bersama
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
