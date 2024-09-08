/**
 * Base model for interacting with and modelling
 * objects in the backend API and database
 */
class ModelBase {
  constructor(id) {
    this.id = id;
  }

  /**
   * Convert from database format to a local object
   * (to implement in child class)
   */
  static objFromDB(data) {
    return null;
  }

  /** Convert to database format from local object */
  static dbFromObj(obj) {
    return obj;
  }

  /** Create a new object in the backend. */
  static async create(apiClient, obj) {
    let newObj = null;
    // strip ID since this is not a PUT or PATCH
    obj = this.dbFromObj(obj);
    delete obj.id;
    // POST to backend
    try {
      const res = await apiClient.post(`${this.endpoint}/`, obj);
      // construct object to return
      newObj = this.objFromDB(res.data);
    } catch (err) {
      console.error(`Error creating new ${this.modelName}: `, err);
    }
    return newObj;
  }

  /** Get all objects from the backend */
  static async getAll(apiClient) {
    let objs = [];
    try {
      const res = await apiClient.get(`${this.endpoint}/`);
      if (res.data.length > 0) {
        objs = res.data.map((o) => this.objFromDB(o));
      }
    } catch (err) {
      console.error(`Error fetching all ${this.modelName}s: `, err);
    }
    return objs;
  }

  /** Get a single object from the backend */
  static async get(apiClient) {
    let obj = null;
    try {
      // GET from backend
      const res = await apiClient.get(`${this.endpoint}/${id}/`);
      obj = this.objFromDB(res.data);
    } catch (err) {
      console.error(`Error fetching ${this.modelName}: `, err);
    }
    return obj;
  }

  /** Delete an object from the backend */
  static async delete(apiClient, id) {
    let status = false;
    try {
      // delete in backend
      const res = await apiClient.delete(`${this.endpoint}/${id}/`);
      status = true;
    } catch (err) {
      console.error(`Error deleting ${this.modelName}: `, err);
    }
    return status;
  }

  /** Update (PATCH) an existing object in the backend */
  static async update(apiClient, id, data) {
    let res = null;
    try {
      // update in backend
      res = await apiClient.patch(`${this.endpoint}/${id}/`, data);
    } catch (err) {
      console.error(`Error updating ${this.modelName}: `, err);
    }
    return res;
  }
}

export default ModelBase;
