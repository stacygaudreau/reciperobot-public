/*
    Recipe Robot logo
*/

import { Bot } from 'lucide-react';
import Link from 'next/link';
import { Roboto } from 'next/font/google';
import { Separator } from '@/components/shadui/separator';

const typeface = Roboto({
  weight: ['500', '700'],
  subsets: ['latin'],
});

const Logo = ({
  isLarge = false,
  isHorizontal = false,
  withSeparator = false,
  className=""
}) => {
  const iconSize = isLarge ? '10' : '7';
  const flexDir = isHorizontal ? '' : 'flex-col';
  const gap = isHorizontal
    ? isLarge
      ? 'gap-4'
      : 'gap-1.5'
    : isLarge
    ? 'gap-0.5'
    : '';
  const m = isHorizontal ? (isLarge ? 'mb-1.5' : 'mb-1') : '';
  const font = isLarge ? 'font-semibold text-2xl' : 'font-semibold text-lg';

  return (
    <header>
      <Link
        href='/'
        className={`flex items-center justify-center ${flexDir} ${gap} ${className}`}
      >
        <Bot className={`h-${iconSize} w-${iconSize} ${m}`} />
        <h1 className={`${font} ${typeface.className} `}>Recipe Robot</h1>
      </Link>
      {withSeparator && <Separator className='mt-6' />}
    </header>
  );
};

export default Logo;
