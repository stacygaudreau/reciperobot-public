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
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthState } from '../Auth/AuthContext';
import Ingredient from '@/lib/models/Ingredient';

import DataTableSortableHeader from '@/components/DataTable/DataTableSortableHeader';
import DataTableCard from '@/components/DataTable/DataTableCard';

const IngredientsTableCard = () => {
  const { user, apiClient } = useAuthState();
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      if (user) {
        try {
          // get ingredients from backend
          let is = await Ingredient.getAll(apiClient);
          setIngredients(is.map((i) => Ingredient.objFromDB(i)));
          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching Ingredients: ', err);
          setError(err);
        }
      }
    };
    fetchIngredients();
  }, [apiClient]);

  /** Delete ingredient and update the list state accordingly */
  const deleteIngredientFromList = async (id) => {
    try {
      await Ingredient.delete(apiClient, id);
      // remove from state
      setIngredients((oldIngredients) =>
        oldIngredients.filter((ing) => ing.id !== id)
      );
    } catch (err) {
      console.error('Error deleting ingredient from list: ', err);
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title='Ingredient' />
      ),
    },
    // {
    //   accessorKey: 'category',
    //   header: ({ column }) => (
    //     <DataTableSortableHeader column={column} title='Category' />
    //   ),
    // },
    // {
    //   accessorKey: 'defaultMeasure',
    //   header: ({ column }) => (
    //     <DataTableSortableHeader column={column} title='Measure' />
    //   ),
    // },
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
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteIngredientFromList(r.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Loading ingredients...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DataTableCard
      columns={columns}
      data={ingredients}
      dataName='ingredient'
      title='Ingredients'
      subtitle='Manage the common ingredients in your pantry.'
    />
  );
};

export default IngredientsTableCard;
