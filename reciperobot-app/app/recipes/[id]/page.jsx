/*
    Recipe rendering view (public)
*/

'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from '@/components/Auth/AuthContext';
import RecipeIngredient from '@/lib/models/RecipeIngredient';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/shadui/card';
import { Badge } from '@/components/shadui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/shadui/table';
import useFetchRecipe from '@/lib/useFetchRecipe';

/** View for displaying and reading a single recipe */
const RecipeView = (context) => {
  const { apiClient } = useAuthState();
  const { id } = context.params;
  const { publicRecipeData, recipeIsLoading, recipeError } = useFetchRecipe(
    apiClient,
    id
  );

  if (recipeIsLoading) {
    return <div>Loading recipe...</div>;
  }

  if (recipeError) {
    return <div>{recipeError}</div>;
  }

  return (
    <div className='grid w-full items-start gap-6 p-0 pt-0'>
      <Card className=''>
        {/* recipe info area */}
        <CardHeader className='mb-0 pb-4'>
          <div className='flex items-center gap-4'>
            <CardTitle className='font-bold text-md md:text-2xl'>
              {publicRecipeData.name}
            </CardTitle>
            <Badge className='text-muted-foreground text-xs' variant='outline'>
              Version {publicRecipeData.version}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='text-muted-foreground text-justify mr-2 md:mr-12 text-md'>
          {publicRecipeData.description}
        </CardContent>
        {/* ingredients */}
        <CardContent>
          <h2 className='text-lg font-semibold mt-0 mb-4'>Ingredients</h2>
          <Table>
            <TableBody>
              {publicRecipeData.ingredients.map((ingredient, i) => (
                <TableRow key={i}>
                  <TableCell className='mr-2 font-medium py-1.5 '>
                    {ingredient.ingredient_name}
                    {ingredient.modifier && (
                      <span className='font-light ml-3'>
                        ({ingredient.modifier})
                      </span>
                    )}
                    <Badge variant='secondary' className='font-normal ml-3'>
                      {RecipeIngredient.getQtyDisplay(
                        ingredient.qty_numerator,
                        ingredient.qty_denominator,
                        ingredient.qty_float
                      )}{' '}
                      {ingredient.measure_name}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {/* directions */}
        <CardContent>
          <h2 className='text-lg font-semibold mt-0 mb-4'>Directions</h2>
          <ol className='my-6 ml-6 list-decimal [&>li]:mt-2.5'>
            {publicRecipeData.steps.map((step, i) => (
              <li key={i} className='text-sm'>
                <span className='px-2 ml-0 font-light cursor-text'>
                  {' ' + step.text}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeView;
