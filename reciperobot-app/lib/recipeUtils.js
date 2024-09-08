/*
    Recipe Robot

    Reusable utilities for creating, editing and otherwise manipulating recipes.
*/

/** Create and edit a new recipe */
const createNewRecipe = async (
  apiClient,
  router,
  version = 1,
  recipeToCopy = null
) => {
  try {
    let recipeToCreate = {};
    // create new recipe in the db
    if (recipeToCopy === null) {
      // default blank recipe
      recipeToCreate = {
        name: 'New recipe',
        description: '',
        version: version,
      };
    } else {
      // make a copy of supplied recipe
      recipeToCreate = {
        ...recipeToCopy,
        version: version,
      };
    }
    const res = await apiClient.post(`recipes/`, recipeToCreate);
    // set it as the composer recipe
    const id = res.data.id;
    await apiClient.post(`set_composer_recipe`, { recipe_id: id });
    // route to the composer for editing
    router.push('/composer');
  } catch (err) {
    console.error('Error creating new recipe: ', err);
  }
};

/** Edit an existing recipe */
const editRecipe = async (apiClient, router, id) => {
  try {
    // set requested id as composer recipe
    await apiClient.post(`set_composer_recipe`, { recipe_id: id });
    // route to the composer for editing
    router.push('/composer');
  } catch (err) {
    console.error('Error editing recipe: ', err);
  }
};

/** Delete a recipe */
const deleteRecipe = async (
  apiClient,
  id,
  router = null,
  reload = false,
  routeTo = null
) => {
  try {
    // delete the specified recipe
    const res = await apiClient.delete(`recipes/${id}/`);
    // forward to an optional new route
    if (router !== null && routeTo !== null) {
      router.push(routeTo);
    }
    // reload current view
    if (router !== null && reload == true) router.refresh();
  } catch (err) {
    console.error('Error deleting recipe: ', err);
  }
};

/** Update the specified Recipe (PATCH) */
const updateRecipe = async (apiClient, id, data) => {
  let res = null;
  try {
    // update in backend
    res = await apiClient.patch(`recipes/${id}/`, data);
  } catch (err) {
    console.error(`Error updating Recipe: `, err);
  }
  return res;
};

/** Toggle whether the given Recipe is public or not */
const toggleIsPublic = async (apiClient, recipeData) => {
  let res = null;
  const newIsPublic = !recipeData.is_public;
  try {
    res = await updateRecipe(apiClient, recipeData.id, {
      is_public: newIsPublic,
    });
  } catch (err) {
    console.error("Error setting Recipe's public state", err);
  }
  return res;
};

export {
  createNewRecipe,
  editRecipe,
  deleteRecipe,
  updateRecipe,
  toggleIsPublic,
};
