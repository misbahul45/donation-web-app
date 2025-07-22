'use client';
import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Heart, Loader2, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BetterSession } from '@/auth';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  session?: BetterSession;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
          router.refresh();
        },
      },
    });
  };

  const handleToRequest=async()=>{

  }

  console.log(session)

  return (
    <header className="w-full sticky top-0 left-0 py-4 flex justify-between lg:px-20 md:px-16 sm:px-10 px-4 z-50 backdrop-blur border-b">
      <div className="flex gap-6 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Heart className="w-6 h-6 fill-current" />
          <span>DonationHub</span>
        </Link>
        <Button variant={'link'} className='dark:text-white dark:hover:text-white text-gray-900 hover:text-gray-800 hidden md:flex'>
          <Link href='/projects' className='font-semibold text-lg'>
            Projects
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="hidden md:flex gap-4 items-center">
          {!(session?.user?.roles.includes('REQUESTER') || session?.user.roles.includes('ADMIN')) && (
            <Button onClick={handleToRequest} className='font-semibold'>
              Become Requester
            </Button>
          ) }

          <ThemeToggle />

          {session && session.user.emailVerified ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 px-4 bg-muted rounded-md text-sm font-medium">
                {session.user.name}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications">Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild className='sm:block hidden'>
                <Link href="/sign-up">Join Now</Link>
              </Button>
            </div>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 md:hidden">
            <div className="flex flex-col space-y-6 mt-8">
              <Button variant={'link'} className='text-white hover:text-white justify-start p-0'>
                <Link href='/projects' className='font-semibold text-lg' onClick={() => setIsOpen(false)}>
                  Projects
                </Link>
              </Button>

              <div className="flex flex-col space-y-4">
                <ThemeToggle />

                {session && session.user.emailVerified ? (
                  <div className="flex flex-col space-y-3">
                    <div className="p-2 px-4 bg-muted rounded-md text-sm font-medium text-center">
                      {session.user.name}
                    </div>
                    <div className="border-t pt-3 flex flex-col space-y-2">
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/notifications" onClick={() => setIsOpen(false)}>Notifications</Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                      </Button>
                      <Button variant="ghost" onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }} className="justify-start">
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <Link href="/sign-in" onClick={() => setIsOpen(false)}>Sign in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/sign-up" onClick={() => setIsOpen(false)}>Join Now</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;