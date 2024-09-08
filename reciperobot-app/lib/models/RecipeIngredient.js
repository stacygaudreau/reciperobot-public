import ModelBase from './ModelBase';

/** RecipeIngredient database model and utilities */
class RecipeIngredient extends ModelBase {
  static endpoint = 'recipe_ingredients';
  static modelName = 'RecipeIngredient';

  constructor(
    id,
    order,
    qtyFloat,
    qtyNum,
    qtyDen,
    modifier,
    measureId,
    ingredientId,
    recipeId
  ) {
    super(id);
    this.order = order;
    this.qtyFloat = qtyFloat;
    this.qtyNum = qtyNum;
    this.qtyDen = qtyDen;
    this.modifier = modifier;
    this.measureId = measureId;
    this.ingredientId = ingredientId;
    this.recipeId = recipeId;
  }

  static objFromDB(data) {
    return new RecipeIngredient(
      data.id,
      data.order,
      data.qty_float,
      data.qty_numerator,
      data.qty_denominator,
      data.modifier,
      data.measure,
      data.ingredient,
      data.recipe
    );
  }

  static dbFromObj(obj) {
    return {
      id: obj.id,
      order: obj.order,
      qty_float: obj.qtyFloat,
      qty_numerator: obj.qtyNum,
      qty_denominator: obj.qtyDen,
      modifier: obj.modifier,
      measure: obj.measureId,
      ingredient: obj.ingredientId,
      recipe: obj.recipeId,
    };
  }

  /** Parse two integers a/b and format as a simplified fraction. */
  static intToFraction(a, b) {
    // greatest common denominator
    const gcd = (n, d) => (d === 0 ? n : gcd(d, n % d));
    const div = gcd(a, b);
    const num = a / div;
    const den = b / div;
    // return as simple whole number if appropriate
    // else, fractonal rep'n
    return den === 1 ? `${num}` : `${num}/${den}`;
  }

  /**
   * Get quantity in display format, depending whether it
   * is a whole number, float or rational fraction.
   */
  static getQtyDisplay(num, den, float) {
    if (den === 0) {
      // float formatted to two dec. places maximum
      let f = parseFloat(float).toFixed(2);
      return f.endsWith('.00') ? `${parseInt(f)}` : `${f}`;
    } else {
      // either a whole number or fraction representation
      // -> treat num/den as integers
      return RecipeIngredient.intToFraction(num, den);
    }
  }

  /** Get this instance's qty in display format */
  getQty() {
    return RecipeIngredient.getQtyDisplay(this.qtyNum, this.qtyDen, this.qtyFloat);
  }

  /** Delete all ingredients related to a given recipe ID */
  static async deleteAllForRecipe(apiClient, id) {
    let ingredients = [];
    let status = false;
    // fetch ingredients for recipe
    try {
      const res = await apiClient.get(`recipes/${id}/recipe_ingredients/`);
      if (res !== null) ingredients = res.data;
      if (ingredients.length > 0) {
        status = true;
        ingredients.forEach(async (ing) => {
          status = await this.delete(apiClient, ing.id);
        });
      }
    } catch (err) {
      console.error('Error fetching ingredients for recipe: ', err);
    }
    return status;
  }

  /** Write a collection of ingredients to a recipe */
  static async writeAllForRecipe(apiClient, ingredients) {
    let status = null;
    try {
      ingredients.forEach(async (ing, i) => {
        ing.order = i; // rewrite the ordering
        status = await this.create(apiClient, ing);
      });
    } catch (err) {
      console.error('Error writing ingredients to Recipe: ', err);
    }
    return status;
  }
}

export default RecipeIngredient;
