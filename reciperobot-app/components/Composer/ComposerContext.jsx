import { useState, createContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuthState } from '../Auth/AuthContext';
import useFetchRecipe from '@/lib/useFetchRecipe';
import { createNewRecipe, deleteRecipe, updateRecipe, toggleIsPublic } from '@/lib/recipeUtils';
import RecipeStep from '@/lib/models/RecipeStep';
import Ingredient from '@/lib/models/Ingredient';
import RecipeIngredient from '@/lib/models/RecipeIngredient';
import Measure from '@/lib/models/Measure';
import { useRouter } from 'next/navigation';

/**
 * Context for sharing Recipe Composer editing state between
 * many components.
 * Saves a bunch of messy prop drilling state and setters.
 */
export const ComposerContext = createContext();

/**
 * Recipe Composer state context
 * - handles retrieval and writing of recipe being edited by user
 * - maintains in-flight copy of recipe being edited as well
 *  as recently fetched from backend
 * - contains recipe editor state common to multiple child components
 */
export const ComposerStateProvider = ({ children }) => {
  const { user, apiClient } = useAuthState();
  const [mode, setModeState] = useState('standby'); // composer editing mode
  const [hasChanges, setHasChangesState] = useState(false); // true when there are changes pending

  // new recipe data format
  const [recipeId, setRecipeId] = useState(null);
  // recipeData is from the *backend*
  // -> an in-flight, potentially modified copy of the recipe is loaded in Composer
  //    memory, until the "Save" button is used to transact with the backend and
  //    write Recipe data to the db
  const { recipeData, setRecipeData, recipeIsLoading, recipeError } =
    useFetchRecipe(apiClient, recipeId);
  const router = useRouter();

  // console.log('LOADED RECIPE DATA: ', recipeData);
  const [ingredients, setIngredientsState] = useState([]);
  const [measures, setMeasures] = useState([]);

  /*
      EFFECTS
  */
  /** The user's presently loaded recipe is fetched from the backend */
  useEffect(() => {
    // get recipe data
    const fetchRecipeData = async () => {
      if (user) {
        try {
          // fetch the ID of the presently edited recipe for
          // the user (if it exists)
          let res = await apiClient.get(`users/me/`);
          const editingId = res.data.composer_recipe;
          if (editingId !== null) {
            // updating the edited ID's state triggers fetching
            // the recipe itself
            setRecipeId(editingId);
          } else {
            // no recipe being edited; make a new one
            console.log('No recipe loaded; creating new one...');
            createNewRecipe(apiClient, router);
            router.refresh();
          }
        } catch (err) {
          console.error('Error fetching recipe: ', err);
        }
      }
    };
    // get user's ingredients
    const fetchIngredients = async () => {
      if (user) {
        try {
          let is = await Ingredient.getAll(apiClient);
          setIngredients(is.map((i) => Ingredient.objFromDB(i)));
          // console.log('INGREDIENTS: ', is);
        } catch (err) {
          console.error('Error fetching Ingredients: ', err);
        }
      }
    };
    // get user's measures
    const fetchMeasures = async () => {
      if (user) {
        try {
          let ms = await Measure.getAll(apiClient);
          setMeasures(ms.map((m) => Measure.objFromDB(m)));
          // console.log('MEASURES: ', ms);
        } catch (err) {
          console.error('Error fetching Measures: ', err);
        }
      }
    };
    fetchIngredients();
    fetchMeasures();
    fetchRecipeData();
  }, [recipeId, apiClient]);

  /*
      BACKEND SAVE/COMMIT FUNCTIONS
  */
  /** Commit current recipe info to the backend */
  const commitRecipeInfo = async () => {
    try {
      let res = await updateRecipe(apiClient, recipeId, {
        name: recipeData.name,
        description: recipeData.description,
      });
    } catch (err) {
      console.error('Error committing recipe info: ', err);
    }
  };
  /** Commit RecipeIngredients to backend */
  const commitRecipeIngredients = async () => {
    // 1. delete existing
    await RecipeIngredient.deleteAllForRecipe(apiClient, recipeId);
    // 2. write new ingredients
    await RecipeIngredient.writeAllForRecipe(apiClient, recipeData.ingredients);
  };
  /** Commit RecipeSteps to backend */
  const commitRecipeSteps = async () => {
    // 1. delete existing
    await RecipeStep.deleteAllForRecipe(apiClient, recipeId);
    // 2. write new steps
    await RecipeStep.writeAllForRecipe(apiClient, recipeData.steps);
  };
  /** Save in-flight recipe changes to db */
  const commitChangesToBackend = async () => {
    await commitRecipeInfo();
    await commitRecipeSteps();
    await commitRecipeIngredients();
    setModeEditing();
  };
  /** Discard in-flight recipe edits */
  const discardChanges = () => {
    if (hasChanges) {
      // trigger a reload of recipe data from backend
      router.refresh();
    }
    setHasChangesState(false);
    setModeState('standby');
  };

  /*
      COMPOSER FRONTEND DATA FUNCTIONS
  */
  /** Set a new given composer mode */
  const setMode = (x) => {
    setModeState(x);
  };
  /** Flag the recipe composer as having changes */
  const setHasChanges = () => {
    setHasChangesState(true);
    setModeState('save');
  };
  /** Activate editing mode */
  const setModeEditing = () => {
    setModeState('editing');
    setHasChangesState(false);
  };
  /** Update the direction steps of the recipe with a new
      array of steps objects */
  const setSteps = (newSteps) => {
    setRecipeData({ ...recipeData, steps: newSteps });
    setHasChanges();
  };
  /** Add a new direction step to the recipe being edited */
  const addStep = async (text) => {
    // create new step with random uuid (id replaced by backend)
    let newStep = new RecipeStep(
      uuidv4(),
      recipeData.steps.length,
      recipeId,
      text
    );
    // update list
    setSteps([...recipeData.steps, newStep]);
    setHasChanges();
  };
  /** Remove a step with the given ID */
  const deleteStep = (id) => {
    // remove from composer list
    let newSteps = recipeData.steps.filter((step) => step.id !== id);
    setSteps(newSteps);
  };
  /** Update a step with the given ID */
  const updateStep = (id, newText) => {
    // update composer list
    let step = recipeData.steps.find((s) => s.id === id);
    step.text = newText;
    setSteps(recipeData.steps);
  };
  /** Overwrite list of ingredients to be used in the recipe */
  const setRecipeIngredients = (newRecipeIngredients) => {
    setRecipeData({ ...recipeData, ingredients: newRecipeIngredients });
    setHasChanges();
  };
  /** Add an ingredient to the presently edited recipe */
  const addRecipeIngredient = async (
    ingredient,
    qty,
    measure,
    modifier = null
  ) => {
    // create new ingredient with random uuid (id replaced by backend)
    let newRecipeIngredient = new RecipeIngredient(
      uuidv4(),
      recipeData.ingredients.length,
      qty,
      qty,
      0,
      modifier,
      measure.id,
      ingredient.id,
      recipeId
    );
    // update composer list
    setRecipeIngredients([...recipeData.ingredients, newRecipeIngredient]);
    setHasChanges();
  };
  /** Remove a recipe ingredient with the given ID */
  const deleteRecipeIngredient = async (id) => {
    // remove from composer list
    let newIngredients = recipeData.ingredients.filter((ing) => ing.id !== id);
    setRecipeIngredients(newIngredients);
  };
  /** Update an existing recipe ingredient with the specified ID */
  const updateRecipeIngredient = async (
    id,
    ingredient,
    qty,
    measure,
    modifier
  ) => {
    // update in the backend
    const res = await RecipeIngredient.update(apiClient, id, {
      ingredient: ingredient.id,
      qty_float: qty,
      qty_numerator: qty,
      qty_denominator: 0,
      measure: measure.id,
      modifier: modifier,
    });
    // find existing recipe ingredient in list and modify it in place
    if (res !== null) {
      // modify the ingredient in place
      const ing = recipeData.ingredients.find((ing) => ing.id === id);
      ing.ingredientId = ingredient.id;
      ing.qtyFloat = qty;
      ing.qtyNum = qty;
      ing.qtyDen = 0;
      ing.measureId = measure.id;
      ing.modifier = modifier;
      // ..and update the recipe state
      setRecipeIngredients(recipeData.ingredients);
    }
  };
  /** Set the name of the recipe */
  const setName = (newName) => {
    setRecipeData({ ...recipeData, name: newName });
    setHasChanges();
  };
  /** Set the description text for the recipe */
  const setDescription = (newDescription) => {
    setRecipeData({ ...recipeData, description: newDescription });
    setHasChanges();
  };
  /** Set a new array of objects for the ingredients library */
  const setIngredients = (newIngredients) => {
    setIngredientsState(newIngredients);
  };
  /** Add an ingredient by name to the ingredient library */
  const addIngredient = async (name) => {
    // add to backend
    let newIngredient = await Ingredient.create(
      apiClient,
      new Ingredient(null, name)
    );
    if (newIngredient !== null) {
      // update list
      setIngredients([...ingredients, newIngredient]);
    }
  };

  /*
      MISC. FUNCTIONS
  */
  /** Delete the currently loaded Composer recipe */
  const deleteCurrentRecipe = async () => {
    await deleteRecipe(apiClient, recipeId, router, false, '/recipes');
  };
  /** Create a new recipe and begin editing it */
  const createAndEditNewRecipe = async () => {
    await createNewRecipe(apiClient, router);
    router.refresh();
  };
  /** Create a new version of the current recipe */
  const createNewVersionOfRecipe = async () => {
    await createNewRecipe(
      apiClient,
      router,
      recipeData.version + 1,
      recipeData
    );
    router.refresh();
  };
  /** Toggle whether the current recipe is public or not */
  const toggleRecipePublic = () => {
    let res = toggleIsPublic(apiClient, recipeData);
    if (res) {
      // update frontend state
      setRecipeData({...recipeData, is_public: !recipeData.is_public});
    }
  }

  return (
    <ComposerContext.Provider
      value={{
        mode,
        ingredients,
        addIngredient,
        measures,
        setMode,
        hasChanges,
        setModeEditing,
        addStep,
        deleteStep,
        updateStep,
        setSteps,
        setRecipeIngredients,
        addRecipeIngredient,
        deleteRecipeIngredient,
        updateRecipeIngredient,
        setName,
        setDescription,
        // new recipeData
        commitChangesToBackend,
        recipeData,
        setRecipeData,
        recipeIsLoading,
        recipeError,
        discardChanges,
        deleteCurrentRecipe,
        createAndEditNewRecipe,
        createNewVersionOfRecipe,
        toggleRecipePublic,
      }}
    >
      {children}
    </ComposerContext.Provider>
  );
};
