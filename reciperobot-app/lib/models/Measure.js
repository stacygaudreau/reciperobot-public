import ModelBase from './ModelBase';

/** Measure database model and utilities */
class Measure extends ModelBase {
  static endpoint = 'measures';
  static modelName = 'Measure';

  constructor(id, name, unitType) {
    super(id);
    this.name = name;
    this.unitType = unitType;
  }

  static objFromDB(data) {
    return new Measure(data.id, data.name, data.unit_type);
  }

  static dbFromObj(obj) {
    return {
      id: obj.id,
      name: obj.name,
      unit_type: obj.unitType,
    };
  }
}

export default Measure;


/*
    "id": 1,
    "name": "cup",
    "unit_type": "volume",
    "url": "http://localhost:8000/api/measures/1/"
*/