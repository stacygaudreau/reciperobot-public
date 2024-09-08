import { Montserrat as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import DashboardContainer from '@/components/Dashboard';
import { Ropa_Sans } from 'next/font/google';
import './globals.scss';

const fontSans = FontSans({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Recipe Robot',
  description: 'The personal recipe library application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased`,
          fontSans.variable
        )}
      >
        <DashboardContainer>{children}</DashboardContainer>
      </body>
    </html>
  );
}
