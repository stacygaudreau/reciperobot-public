import ModelBase from './ModelBase';

/** RecipeStep database model and utilities */
class RecipeStep extends ModelBase {
  static endpoint = 'recipe_steps';
  static modelName = 'RecipeStep';

  constructor(id, order, recipeId, text) {
    super(id);
    this.order = order;
    this.recipeId = recipeId;
    this.text = text;
  }

  static objFromDB(data) {
    return new RecipeStep(data.id, data.order, data.recipe, data.text);
  }

  static dbFromObj(obj) {
    return {
      id: obj.id,
      order: obj.order,
      recipe: obj.recipeId,
      text: obj.text,
    };
  }

  /** Delete all steps related to a given recipe ID */
  static async deleteAllForRecipe(apiClient, id) {
    let steps = [];
    let status = false;
    // fetch steps for recipe
    try {
      const res = await apiClient.get(`recipes/${id}/recipe_steps/`);
      if (res !== null) steps = res.data;
      if (steps.length > 0) {
        status = true;
        steps.forEach(async (step) => {
          status = await this.delete(apiClient, step.id);
        });
      }
    } catch (err) {
      console.error('Error fetching steps for recipe: ', err);
    }
    return status;
  }
  /** Write a collection of steps to a recipe */
  static async writeAllForRecipe(apiClient, steps) {
    let status = null;
    try {
      steps.forEach(async (step, i) => {
        step.order = i; // rewrite the ordering
        status = await this.create(apiClient, step);
      })
    } catch (err) {
      console.error("Error writing steps to Recipe: ", err);
    }
    return status;
  }
}

export default RecipeStep;
