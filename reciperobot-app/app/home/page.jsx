'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/shadui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/shadui/table';
import { Badge } from '@/components/shadui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/shadui/dropdown-menu';
import { Button, buttonVariants } from '@/components/shadui/button';
import { MoreHorizontal, Eye } from 'lucide-react';
import Image from 'next/image';
import { useAuthState } from '@/components/Auth/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

/** A single recipe in the list of public recipes. */
const RecipeListItem = ({ id, name, category, username, date, version }) => {
  return (
    <TableRow>
      <TableCell>
        <Link
          size='icon'
          href={`/recipes/${id}`}
          className={buttonVariants({ variant: 'ghost' })}
        >
          <Eye className='h-4 w-4' />
          <span className='sr-only'>View recipe</span>
        </Link>
      </TableCell>
      <TableCell className='font-medium'>{name}</TableCell>
      {/* <TableCell>
        {category !== '' && <Badge variant='outline'>{category}</Badge>}
      </TableCell> */}
      <TableCell>
        {category !== '' && (
          <Badge className='text-muted-foreground' variant='outline'>
            Version {version}
          </Badge>
        )}
      </TableCell>
      <TableCell>{username}</TableCell>
      <TableCell className='hidden md:table-cell'>{date}</TableCell>
      {/* <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup='true' size='icon' variant='ghost'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Export to PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell> */}
    </TableRow>
  );
};

/** Table/list of public recipes */
const PublicRecipes = () => {
  const { apiClient, user } = useAuthState();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchPublicRecipes = async () => {
      try {
        // get public recipes
        let res = await apiClient.get('recipes/public/');
        setRecipes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPublicRecipes();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Logo isLarge className='my-4' />
      <Card>
        <CardHeader className={'text-center'}>
          <CardTitle className={''}>Latest recipes</CardTitle>
          <CardDescription className={'pt-2'}>
            Taste some of these recipes shared by our users!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            {/* table head */}
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Recipe</TableHead>
                {/* <TableHead>Category</TableHead> */}
                <TableHead>Version</TableHead>
                <TableHead>Shared by</TableHead>
                <TableHead className='hidden md:table-cell'>
                  Created on
                </TableHead>
                {/* <TableHead>
                <span className='sr-only'>Actions</span>
              </TableHead> */}
              </TableRow>
            </TableHeader>
            {/* public recipes list */}
            <TableBody>
              {recipes.map((recipe) => {
                return (
                  <RecipeListItem
                    id={recipe.id}
                    key={recipe.id}
                    name={recipe.name}
                    username={recipe.user_username}
                    category={'Snack'}
                    version={recipe.version}
                    date={recipe.created_date}
                  />
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicRecipes;
