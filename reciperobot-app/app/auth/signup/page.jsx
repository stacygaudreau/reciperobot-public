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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/shadui/select';
import { Button } from '@/components/shadui/button';
import Link from 'next/link';
import ErrorAlert from '@/components/Alerts/ErrorAlert';
import { useAuthState } from '@/components/Auth/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';


const SignupView = () => {
  const { signup } = useAuthState();
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(username, email, password1, password2);
      setError('');
      // forward to login page upon success
      router.push('/auth/login');
    } catch (err) {
      setError('Signup failed!');
      console.error(err);
    }
  }

  return (
    <div className='flex flex-col justify-center gap-4 items-center'>
      {error != '' && <ErrorAlert message={error} />}
      <Card className='w-[350px]'>
      <CardHeader className='text-center'>
          <Logo isLarge withSeparator/>
          <CardTitle className={"pt-6"}>Sign up</CardTitle>
          <CardDescription>
            Sign up for an account to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
        <CardContent>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='username'>Username</Label>
                <Input id='username' placeholder='Username' type='text' value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}/>
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='username'>Email</Label>
                <Input
                  id='email'
                  placeholder='Email'
                  type='email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='username'>Password</Label>
                <Input id='password1' placeholder='Password' type='password' value={password1}
                  onChange={(e) => {
                    setPassword1(e.target.value);
                  }}/>
                <Input
                  id='password2'
                  placeholder='Password (again)'
                  type='password'
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value);
                  }}
                />
              </div>
            </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button className='w-full'>Sign up</Button>
          <p className='text-left w-full text-muted-foreground text-sm'>
            Have an account?{' '}
            <Link href='/auth/login' className='font-medium'>
              Login here.
            </Link>
          </p>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignupView;
