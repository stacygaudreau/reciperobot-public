'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/shadui/card';
import { Label } from '@/components/shadui/label';
import { Input } from '@/components/shadui/input';
import { Button } from '@/components/shadui/button';
import Link from 'next/link';
import { useState } from 'react';
import ErrorAlert from '@/components/Alerts/ErrorAlert';
import { useAuthState } from '@/components/Auth/AuthContext';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { Separator } from '@/components/shadui/separator';


const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthState();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setError('');
      router.push('/home');
    } catch (err) {
      setError('Login failed! Wrong username or password.');
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col justify-center gap-4 items-center'>
      {error != '' && <ErrorAlert message={error} />}
      <Card className='w-[350px]'>
        <CardHeader className='text-center'>
          <Logo isLarge withSeparator/>
          <CardTitle className='pt-6'>Login</CardTitle>
          <CardDescription>
            Login to get started creating recipes!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  type='text'
                  id='username'
                  placeholder='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  placeholder='Password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button className='w-full' type='submit'>
              Login
            </Button>
            <p className='text-left w-full text-muted-foreground text-sm'>
              No account?{' '}
              <Link href='/auth/signup' className='font-medium'>
                Sign up here.
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginView;
