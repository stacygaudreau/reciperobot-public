import ModelBase from './ModelBase';

/** Ingredient database model and utilities */
class Ingredient extends ModelBase {
  static endpoint = 'ingredients';
  static modelName = 'Ingredient';

  constructor(id, name) {
    super(id);
    this.name = name;
  }

  static objFromDB(data) {
    return new Ingredient(data.id, data.name);
  }

  static dbFromObj(obj) {
    return {
      id: obj.id,
      name: obj.name,
    };
  }
}

export default Ingredient;
