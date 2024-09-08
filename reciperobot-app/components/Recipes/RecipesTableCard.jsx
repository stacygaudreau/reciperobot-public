'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/shadui/dropdown-menu';
import { Button } from '@/components/shadui/button';
import { MoreHorizontal } from 'lucide-react';

import DataTableSortableHeader from '@/components/DataTable/DataTableSortableHeader';
import DataTableCard from '@/components/DataTable/DataTableCard';
import { useAuthState } from '../Auth/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewRecipe, editRecipe, deleteRecipe, toggleIsPublic } from '@/lib/recipeUtils';
import PublicSwitch from '../Composer/PublicSwitch';


const RecipesTableCard = () => {
  const { user, apiClient } = useAuthState();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // fetch all the user's recipes
        let res = await apiClient.get(`recipes/mine/`);
        setRecipes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching recipes. Are you logged in?');
        setLoading(false);
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [user]);

  /** Delete recipe and update the list state accordingly */
  const deleteRecipeFromList = async (id) => {
    try {
      await deleteRecipe(apiClient, id);
      // remove from state
      setRecipes((oldRecipes) => oldRecipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Error deleting recipe from list: ', err);
    }
  }

  const handleTogglingRecipeIsPublic = async (recipe) => {
    let res = null;
    try {
      res = await toggleIsPublic(apiClient, recipe);
    } catch (err) {
      console.error("Error toggling recipe is_public in Recipe List", err);
    }
    if (res) {
      // update state in frontend
      recipe.is_public = !recipe.is_public;
      setRecipes([...recipes]);
    }
  }

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const columns = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title='Recipe' />
      ),
    },
    // {
    //   accessorKey: 'category',
    //   header: ({ column }) => (
    //     <DataTableSortableHeader column={column} title='Category' />
    //   ),
    // },
    {
      accessorKey: 'version',
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title='Version' />
      ),
    },
    {
      accessorKey: 'created_date',
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title='Date Created' />
      ),
    },
    {
      id: 'public',
      cell: ({ row}) => {
        const r = row.original;
        return (
          <PublicSwitch isPublic={r.is_public} toggleIsPublicFn={() => {handleTogglingRecipeIsPublic(r)}} disableText/>
        );
      },
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title='Public' />
      ),
    },
    // more/action menu button
    {
      id: 'actions',
      cell: ({ row }) => {
        const r = row.original;
        return (
          <DropdownMenu> 
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(r.id)}
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  editRecipe(apiClient, router, r.id);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
              onClick={() => {
                deleteRecipeFromList(r.id);
              }}
              >Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      
    },
  ];

  return (
    <DataTableCard
      columns={columns}
      data={recipes}
      dataName='recipe'
      title='My Recipes'
      subtitle='Create and organise your recipes here.'
      dataNewEntryFn={() => {
        createNewRecipe(apiClient, router);
      }}
    />
  );
};

export default RecipesTableCard;
