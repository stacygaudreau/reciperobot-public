/*
    Data structure for a Recipe in Recipe Robot.
*/

export class Ingredient {
  constructor() {}

}

// to-do: finish writing this class once more than one recipe instance
// are needed in the context state.
class Recipe {
  constructor() {
    this.name = '';
    this.version = 1;
    this.description = '';
    this.ingredients = [];
    this.steps = [];
  }
}

export default Recipe;
