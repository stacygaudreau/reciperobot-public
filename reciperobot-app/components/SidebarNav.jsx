/*
    Recipe Robot
    Navigation sidebar
*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  Bot,
  CookingPot,
  BookText,
  Wheat,
  Pencil,
  ShoppingBasket,
  FolderDown,
  Settings,
} from 'lucide-react';

const applyLinkStyle = (pathname, str) =>
  `${pathname.includes(str) ? 'bg-muted text-foreground' : `text-muted-foreground`}`;

const SidebarNav = () => {
  const pathname = usePathname();
  return (
    <nav className='flex flex-col flex-grow justify-between px-2 text-sm font-medium lg:px-4'>
      {/* top items */}
      <div>
        <Link
          href='/recipes'
          className={`${applyLinkStyle(pathname, '/recipes')} 
            flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:text-primary`}
        >
          <BookText className='h-4 w-4' />
          Recipes
        </Link>
        <Link
          href='/ingredients'
          className={`${applyLinkStyle(pathname, '/ingredients')} 
            flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:text-primary`}
        >
          <Wheat className='h-4 w-4' />
          Ingredients
          {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                </Badge> */}
        </Link>
        <Link
          href='/composer'
          className={`${applyLinkStyle(pathname, '/composer')} 
            flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:text-primary`}
        >
          <Pencil className='h-4 w-4' />
          Composer
        </Link>
        <Link
          href='#'
          className={`${applyLinkStyle(pathname, '/export')} 
            flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:text-primary`}
        >
          <FolderDown className='h-4 w-4' />
          Export
        </Link>
      </div>
      {/* bottom items */}
      <div className='py-4'>
        {/* <Link
          href='#'
          className='flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:text-primary'
        >
          <Settings className='h-4 w-4' />
          Settings
        </Link> */}
      </div>
    </nav>
  );
};

export default SidebarNav;
