import { useState, useEffect } from 'react';
import RecipeIngredient from './models/RecipeIngredient';
import RecipeStep from './models/RecipeStep';

/** Fetch a Recipe by id and all of its related data from the backend. */
const useFetchRecipe = (apiClient, id) => {
  const [recipeData, setRecipeData] = useState(null);
  const [publicRecipeData, setPublicRecipeData] = useState(null);
  const [recipeIsLoading, setRecipeIsLoading] = useState(true);
  const [recipeError, setRecipeError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const [resRecipe, resIngredients, resSteps] = await Promise.all([
          apiClient.get(`recipes/${id}/`),
          apiClient.get(`recipes/${id}/recipe_ingredients/`),
          apiClient.get(`recipes/${id}/recipe_steps/`),
        ]);
          setPublicRecipeData({
            ...resRecipe.data,
            ingredients: resIngredients.data,
            steps: resSteps.data,
          });
          setRecipeData({
            ...resRecipe.data,
            ingredients: resIngredients.data.map(i => RecipeIngredient.objFromDB(i)),
            steps: resSteps.data.map(s => RecipeStep.objFromDB(s)),
          });
        setRecipeIsLoading(false);
      } catch (err) {
        console.error(err);
        setRecipeError('Recipe not found! You may not have permission to view it.');
        setRecipeIsLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, apiClient]);

  return { recipeData, publicRecipeData, recipeIsLoading, setRecipeIsLoading, recipeError, setRecipeData };
};

export default useFetchRecipe;
