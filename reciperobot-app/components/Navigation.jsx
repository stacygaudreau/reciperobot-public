/*
    Left side navigation column
*/

'use client';

import Link from 'next/link';
import { Bot, BookText, Wheat, Pencil, FolderDown, Menu, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/shadui/tooltip';
import { Sheet, SheetTrigger, SheetContent } from '@/components/shadui/sheet';
import { Button } from '@/components/shadui/button';

const applyLinkStyle = (pathname, str) =>
  `${
    pathname.includes(str)
      ? 'bg-accent text-accent-foreground'
      : `text-muted-foreground`
  }`;

/** Left sidebar navigation */
export const SideNav = () => {
  const pathname = usePathname();
  return (
    <nav className='flex flex-col items-center gap-4 px-2 py-4'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href='/home'
            className={`${applyLinkStyle(
              pathname,
              '/home'
            )} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
          >
            <Home className='h-5 w-5' />
            <span className='sr-only'>Home</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>Home</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href='/recipes'
            className={`${applyLinkStyle(
              pathname,
              '/recipes'
            )} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
          >
            <BookText className='h-5 w-5' />
            <span className='sr-only'>Recipes</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>Recipes</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href='/ingredients'
            className={`${applyLinkStyle(
              pathname,
              '/ingredients'
            )} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
          >
            <Wheat className='h-5 w-5' />
            <span className='sr-only'>Ingredients</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>Ingredients</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href='/composer'
            className={`${applyLinkStyle(
              pathname,
              '/composer'
            )} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
          >
            <Pencil className='h-5 w-5' />
            <span className='sr-only'>Composer</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>Composer</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href='#'
            className={`${applyLinkStyle(
              pathname,
              '/export'
            )} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
          >
            <FolderDown className='h-5 w-5' />
            <span className='sr-only'>Export</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>Export</TooltipContent>
      </Tooltip>
    </nav>
  );
};

/** Mobile navigation popover sheet */
export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' variant='outline' className='sm:hidden'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='sm:max-w-xs'>
        <nav className='grid gap-6 text-lg font-medium'>
          <Link
            href='/'
            className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'
          >
            <Bot className='h-5 w-5 transition-all group-hover:scale-110' />
            <span className='sr-only'>Recipe Robot</span>
          </Link>
          <Link
            href='/recipes'
            className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
          >
            <BookText className='h-5 w-5' />
            Recipes
          </Link>
          <Link
            href='/ingredients'
            className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
          >
            <Wheat className='h-5 w-5' />
            Ingredients
          </Link>
          <Link
            href='/composer'
            className='flex items-center gap-4 px-2.5 text-foreground'
          >
            <Pencil className='h-5 w-5' />
            Composer
          </Link>
          <Link
            href='#'
            className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
          >
            <FolderDown className='h-5 w-5' />
            Export
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
