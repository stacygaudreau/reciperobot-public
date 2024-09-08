/*
    Recipe Robot
    Main Application Dashboard Layout
*/

'use client';

import { CircleUser, Menu, Search, Bot, Settings } from 'lucide-react';
import { Button } from '@/components/shadui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/shadui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadui/dropdown-menu';
import Link from 'next/link';
import { Skeleton } from '@/components/shadui/skeleton';
import { SideNav, MobileNav } from './Navigation';
import { AuthStateProvider, useAuthState } from '@/components/Auth/AuthContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const Dashboard = ({ children }) => {
  const { user, logout, isLoading } = useAuthState();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // if (isLoading) {
  //   return (
  //   <div className='flex flex-col space-y-3'>
  //     <Skeleton className="h-[125px] w-[250px] rounded-xl" />
  //     <div className="space-y-2">
  //       <Skeleton className="h-4 w-[250px]" />
  //       <Skeleton className="h-4 w-[200px]" />
  //     </div>
  //   </div>
  //   )
  // }

  return (
    <TooltipProvider delayDuration={0}>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
          <div className='border-b p-2'>
            <Button variant='outline' size='icon' aria-label='Home'>
              <Bot className='size-5 ' />
            </Button>
          </div>
          {user && <SideNav />}
        </aside>
        <div className='flex flex-col sm:gap-4 sm:pl-14'>
          <header className='sticky w-full top-0 z-10 flex flex-row h-[57px] items-center gap-4 border-b bg-background px-4 sm:px-6'>
            <h1 className='hidden'>Recipe Robot</h1>
            <h1 className='hidden sm:block font-semibold text-lg'>
              Recipe Robot
            </h1>
            {user && <MobileNav />}
            {user && (
              <div className='relative ml-auto flex-1 md:grow-0'>
                {/* <Input
                  type='search'
                  placeholder='Search...'
                  className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]'
                /> */}
              </div>
            )}
            {!isLoading ? (
              user ? (
                <>
                  <span className='font-semibold text-sm'>{user.username}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        size='icon'
                        className='overflow-hidden rounded-full'
                      >
                        {/* 
                        (placeholder for user profile image)
                        <Image
                        src="/placeholder-user.jpg"
                        width={36}
                        height={36}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                      /> */}
                        <CircleUser className='text-gray-600' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Button
                          className='w-full'
                          variant='outline'
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <div className='relative ml-auto flex-1 md:grow-0' />
                  <Button variant='ghost' className=''>
                    <Link href='/auth/signup'>Sign up</Link>
                  </Button>
                  <Button className='' variant='outline' asChild>
                    <Link href='/auth/login'>Login</Link>
                  </Button>
                </>
              )
            ) : (
              <div className='flex items-end relative ml-auto flex-1 md:grow-0 gap-4'>
                <div className='space-y-2 flex flex-col justify-end items-end'>
                  <Skeleton className='h-4 w-[250px]' />
                  <Skeleton className='h-4 w-[200px]' />
                </div>
                <Skeleton className='h-12 w-12 rounded-full' />
              </div>
            )}
          </header>
          <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

const DashboardContainer = ({ children }) => {
  return (
    <AuthStateProvider>
      <Dashboard>{children}</Dashboard>
    </AuthStateProvider>
  );
};

export default DashboardContainer;
