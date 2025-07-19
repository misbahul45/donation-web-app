'use client';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { authClient } from '@/lib/auth-client';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const Header = () => {
  const { data, isPending } = authClient.useSession();

  console.log(data)
  return (
    <header className="w-full sticky top-0 left-0 py-4 flex justify-between lg:px-20 md:px-16 sm:px-10 px-4 z-50 backdrop-blur">
      <h1>Logo</h1>
      <nav></nav>

      <div className="flex gap-4 items-center">
        <ThemeToggle />

        {isPending ? (
          <div className="flex items-center">
            <Loader2 size={18} className="animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <div className="text-sm text-muted-foreground">
            Halo, {data.user?.name ?? 'Pengguna'}!
          </div>
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
